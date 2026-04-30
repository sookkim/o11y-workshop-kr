# Splunk Integration

Splunk OpenTelemetry Collector는 Prometheus 수신기를 사용하여 모든 Isovalent 구성 요소에서 메트릭을 수집합니다. 각 구성 요소는 서로 다른 포트를 통해 메트릭을 노출하며, Cilium과 Hubble은 동일한 Pod(단지 다른 포트 사용)를 공유하므로 Pod 어노테이션에 의존하는 대신 각 구성 요소에 대해 별도의 수신기를 구성합니다.

| Component       | Port | What it provides                                        |
| --------------- | ---- | ------------------------------------------------------- |
| Cilium Agent    | 9962 | eBPF datapath, policy enforcement, IPAM, BPF map stats  |
| Cilium Envoy    | 9964 | L7 proxy metrics (HTTP, gRPC)                           |
| Cilium Operator | 9963 | Cluster-wide identity and endpoint management           |
| Hubble          | 9965 | Network flows, DNS, HTTP L7, TCP flags, policy verdicts |
| Tetragon        | 2112 | Runtime security, socket stats, network flow events     |

## 1. Splunk Otel Agent 설치를 위한 구성 파일 생성

`splunk-otel-collector-values.yaml` 파일을 생성합니다.
아래 내용중 **<YOUR-SPLUNK-ACCESS-TOKEN>** 과 **<YOUR-SPLUNK-REALM>** 을 맞는 값으로 변경하여 저장합니다

```yaml
terminationGracePeriodSeconds: 30
agent:
  config:
    extensions:
      # k8s_observer watches the Kubernetes API for pod and port changes.
      # This enables automatic service discovery without static endpoint lists.
      k8s_observer:
        auth_type: serviceAccount
        observe_pods: true

    receivers:
      kubeletstats:
        collection_interval: 30s
        insecure_skip_verify: true

      # Cilium Agent (port 9962) and Hubble (port 9965) both run in the
      # same DaemonSet pod, identified by label k8s-app=cilium.
      # We use two separate scrape jobs because they're on different ports.
      prometheus/isovalent_cilium:
        config:
          scrape_configs:
            - job_name: 'cilium_metrics_9962'
              scrape_interval: 30s
              metrics_path: /metrics
              kubernetes_sd_configs:
                - role: pod
              relabel_configs:
                - source_labels: [__meta_kubernetes_pod_label_k8s_app]
                  action: keep
                  regex: cilium
                - source_labels: [__meta_kubernetes_pod_ip]
                  target_label: __address__
                  replacement: ${__meta_kubernetes_pod_ip}:9962
                - target_label: job
                  replacement: 'cilium_metrics_9962'
            - job_name: 'hubble_metrics_9965'
              scrape_interval: 30s
              metrics_path: /metrics
              kubernetes_sd_configs:
                - role: pod
              relabel_configs:
                - source_labels: [__meta_kubernetes_pod_label_k8s_app]
                  action: keep
                  regex: cilium
                - source_labels: [__meta_kubernetes_pod_ip]
                  target_label: __address__
                  replacement: ${__meta_kubernetes_pod_ip}:9965
                - target_label: job
                  replacement: 'hubble_metrics_9965'

      # Cilium Envoy uses a different pod label (k8s-app=cilium-envoy)
      prometheus/isovalent_envoy:
        config:
          scrape_configs:
            - job_name: 'envoy_metrics_9964'
              scrape_interval: 30s
              metrics_path: /metrics
              kubernetes_sd_configs:
                - role: pod
              relabel_configs:
                - source_labels: [__meta_kubernetes_pod_label_k8s_app]
                  action: keep
                  regex: cilium-envoy
                - source_labels: [__meta_kubernetes_pod_ip]
                  target_label: __address__
                  replacement: ${__meta_kubernetes_pod_ip}:9964
                - target_label: job
                  replacement: 'cilium_metrics_9964'

      # Cilium Operator is a Deployment (not DaemonSet), identified by io.cilium.app=operator
      prometheus/isovalent_operator:
        config:
          scrape_configs:
            - job_name: 'cilium_operator_metrics_9963'
              scrape_interval: 30s
              metrics_path: /metrics
              kubernetes_sd_configs:
                - role: pod
              relabel_configs:
                - source_labels: [__meta_kubernetes_pod_label_io_cilium_app]
                  action: keep
                  regex: operator
                - target_label: job
                  replacement: 'cilium_metrics_9963'

      # Tetragon is identified by app.kubernetes.io/name=tetragon
      prometheus/isovalent_tetragon:
        config:
          scrape_configs:
            - job_name: 'tetragon_metrics_2112'
              scrape_interval: 30s
              metrics_path: /metrics
              kubernetes_sd_configs:
                - role: pod
              relabel_configs:
                - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
                  action: keep
                  regex: tetragon
                - source_labels: [__meta_kubernetes_pod_ip]
                  target_label: __address__
                  replacement: ${__meta_kubernetes_pod_ip}:2112
                - target_label: job
                  replacement: 'tetragon_metrics_2112'

    processors:
      # Strict allowlist filter: only forward metrics we've explicitly named.
      # Without this, Cilium and Tetragon can generate thousands of metric series
      # and overwhelm Splunk Observability Cloud with cardinality.
      filter/includemetrics:
        metrics:
          include:
            match_type: strict
            metric_names:
              # --- Kubernetes base metrics ---
              - container.cpu.usage
              - container.memory.rss
              - k8s.container.restarts
              - k8s.pod.phase
              - node_namespace_pod_container
              - tcp.resets
              - tcp.syn_timeouts

              # --- Cilium Agent metrics ---
              # API rate limiting — detect if the agent is being throttled
              - cilium_api_limiter_processed_requests_total
              - cilium_api_limiter_processing_duration_seconds
              # BPF map utilization — alerts when eBPF maps are near capacity
              - cilium_bpf_map_ops_total
              # Controller health — tracks background reconciliation tasks
              - cilium_controllers_group_runs_total
              - cilium_controllers_runs_total
              # Endpoint state — how many pods are in each lifecycle state
              - cilium_endpoint_state
              # Agent error/warning counts — early warning for problems
              - cilium_errors_warnings_total
              # IP address allocation tracking
              - cilium_ip_addresses
              - cilium_ipam_capacity
              # Kubernetes event processing rate
              - cilium_kubernetes_events_total
              # L7 policy enforcement (HTTP, DNS, Kafka)
              - cilium_policy_l7_total
              # DNS proxy latency histogram — key metric for catching DNS saturation
              - cilium_proxy_upstream_reply_seconds_bucket

              # --- Hubble metrics ---
              # DNS query and response counts — primary indicator in the demo scenario
              - hubble_dns_queries_total
              - hubble_dns_responses_total
              # Packet drops by reason (policy_denied, invalid, TTL_exceeded, etc.)
              - hubble_drop_total
              # Total flows processed — overall network activity volume
              - hubble_flows_processed_total
              # HTTP request latency histogram and total count
              - hubble_http_request_duration_seconds_bucket
              - hubble_http_requests_total
              # ICMP traffic tracking
              - hubble_icmp_total
              # Policy verdict counts (forwarded vs. dropped by policy)
              - hubble_policy_verdicts_total
              # TCP flag tracking (SYN, FIN, RST) — connection lifecycle visibility
              - hubble_tcp_flags_total

              # --- Tetragon metrics ---
              # Total eBPF events processed
              - tetragon_events_total
              # DNS cache health
              - tetragon_dns_cache_evictions_total
              - tetragon_dns_cache_misses_total
              - tetragon_dns_total
              # HTTP response tracking with latency
              - tetragon_http_response_total
              - tetragon_http_stats_latency_bucket
              - tetragon_http_stats_latency_count
              - tetragon_http_stats_latency_sum
              # Layer3 errors
              - tetragon_layer3_event_errors_total
              # TCP socket statistics — per-connection RTT, retransmits, byte/segment counts
              # These power the latency and throughput views in Network Explorer
              - tetragon_socket_stats_retransmitsegs_total
              - tetragon_socket_stats_rxsegs_total
              - tetragon_socket_stats_srtt_count
              - tetragon_socket_stats_srtt_sum
              - tetragon_socket_stats_txbytes_total
              - tetragon_socket_stats_txsegs_total
              - tetragon_socket_stats_rxbytes_total
              # UDP statistics
              - tetragon_socket_stats_udp_retrieve_total
              - tetragon_socket_stats_udp_txbytes_total
              - tetragon_socket_stats_udp_txsegs_total
              - tetragon_socket_stats_udp_rxbytes_total
              # Network flow events (connect, close, send, receive)
              - tetragon_network_connect_total
              - tetragon_network_close_total
              - tetragon_network_send_total
              - tetragon_network_receive_total

      resourcedetection:
        detectors: [system]
        system:
          hostname_sources: [os]

    service:
      pipelines:
        metrics:
          receivers:
            - prometheus/isovalent_cilium
            - prometheus/isovalent_envoy
            - prometheus/isovalent_operator
            - prometheus/isovalent_tetragon
            - hostmetrics
            - kubeletstats
            - otlp
          processors:
            - filter/includemetrics
            - resourcedetection

autodetect:
  prometheus: true

clusterName: isovalent-demo

splunkObservability:
  accessToken: <YOUR-SPLUNK-ACCESS-TOKEN>
  realm: <YOUR-SPLUNK-REALM> # e.g. us1, us2, eu0
  profilingEnabled: true

cloudProvider: aws
distribution: eks
environment: isovalent-demo

# Gateway mode runs a central collector deployment that receives from all agents.
# Agents send to the gateway, which handles batching and export to Splunk.
# This reduces the number of direct connections to Splunk's ingest endpoint.
gateway:
  enabled: true
  resources:
    requests:
      cpu: 250m
      memory: 512Mi
    limits:
      cpu: 1
      memory: 1Gi

# certmanager handles mTLS between the OTel Collector agent and gateway
certmanager:
  enabled: true
```

반드시 아래 내용을 교체하여 저장해야합니다

- `<YOUR-SPLUNK-ACCESS-TOKEN>` : Splunk Observability Cloud 액세스 토큰을 입력합니다
- `<YOUR-SPLUNK-REALM>` 사용하시는 도메인(예: us1, us2, eu0)을 입력해 주세요.

> metric allowlist 를 제한하는 이유는? </br>
> Cilium은 워크로드, 네임스페이스 및 프로토콜 세부 정보에 대한 모든 레이블 조합을 고려할 때 수천 개의 고유한 메트릭 시리즈를 생성할 수 있습니다. </br>
> filter/includemetrics 를 사용하지 않으면 사용량이 많은 클러스터에서 50,000개 이상의 활성 시리즈가 생성되어 Splunk의 데이터 수집 용량을 초과할 수 있습니다. </br>
> 위 목록은 Cilium 및 Hubble 대시보드에 필요한 메트릭과 Network Explorer에 필요한 Tetragon 소켓 통계를 정확히 포함하도록 구성되어 있습니다. 나중에 새 대시보드를 추가하는 경우 이 목록에 메트릭을 추가할 수 있습니다.

> 위 설정 중 Tetragon socket stat 이 수집하는 데이터는? </br>
> `tetragon_socket_stats_*` 메트릭은 Splunk의 Network Explorer에서 연결별 지연 시간 및 처리량 분석을 가능하게 하는 핵심 요소입니다. </br>
> `srtt_count` 와 `srtt_sum` 메트릭은 로드별 평균 TCP 왕복 시간을 제공하고, `retransmitsegs_total` 은 패킷 손실 및 혼잡을 파악합니다. </br>
> 또한 `txbytes`, `rxbytes` 은 연결별 대역폭을 보여줍니다. 이러한 정보는 APM이나 표준 인프라 메트릭으로는 확인할 수 없습니다.

</br>

## 2. Splunk Otel Collector 설치 및 검증

```bash
$ helm upgrade --install splunk-otel-collector \
  splunk-otel-collector-chart/splunk-otel-collector \
  -n otel-splunk --create-namespace \
  -f splunk-otel-collector-values.yaml

$ kubectl logs -n otel-splunk -l app=splunk-otel-collector --tail=100 | grep -i "cilium\|hubble\|tetragon"
```

각 구성 요소의 스크래핑이 성공적으로 완료되었음을 나타내는 로그 항목을 확인할 수 있습니다.

</br>

---

**Module 4. Splunk Integration DONE!**
