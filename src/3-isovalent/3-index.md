# Isovalent Splunk Observability Cloud Integration

오늘 진행될 Splunk Ninjas Workshop for IT Service Intelligence 🥷 의 콘텐츠는 아래와 같습니다

원활한 워크샵이 되도록 시간과 아젠다를 참고 부탁드립니다

## Pre-Requisite

본 워크샵은 Splunk Show 의 아래 워크샵을 미리 실행시켜야 진행이 가능합니다

- Splunk4Rookies - Observability

## 교육 목표

이 워크숍이 끝나면 여러분은 다음과 같은 결과를 얻게 될 것입니다:

- Cilium을 CNI로 사용하여 ENI 모드로 Amazon EKS를 배포합니다.
- L7 가시성을 통해 네트워크 관찰이 가능하도록 Hubble을 구성합니다.
- 런타임 보안 모니터링을 위해 Tetragon을 설치하세요.
- OpenTelemetry를 사용하여 eBPF 기반 메트릭을 Splunk Observability Cloud와 통합하세요.
- 통합 대시보드에서 네트워크 흐름, 보안 이벤트 및 인프라 지표를 모니터링하세요.
- eBPF 기반 관찰 가능성 및 kube-proxy 대체에 대해 알아보세요.

## Contents

| 시간        | 인덱스 | 내용                                                                                      | 예상 시간 |
| ----------- | ------ | ----------------------------------------------------------------------------------------- | --------- |
| 10:00~10:20 | -      | 개요 설명                                                                                 | 20분      |
| 10:20~10:30 | 00     | [Set up EKS Cluster](./2-1-service-insights/2-1-index.html)                               | 10분      |
| 10:30~10:40 | 01     | [Cilium Installation](./2-1-service-insights/2-1-1-Services/2-1-1-index.html)             | 10분      |
| 10:40~10:50 | 02     | [Splunk Integration](./2-1-service-insights/2-1-2-KPIs/2-1-2-index.html)                  | 10분      |
|             |        | **10 Min Break Time**                                                                     |
| 11:00~11:30 | 03     | [Varification](./2-1-service-insights/2-1-3-BaseSearches/2-1-3-index.html)                | 30분      |
| 11:30~12:10 | 04     | [Demo](./2-1-service-insights/2-1-4-ImplementService/2-1-4-index.html)                    | 40분      |
|             |        | **1 Hour Lunch Time**                                                                     |
| 13:10~13:50 | 05, 06 | [Entities](./2-1-service-insights/2-1-5-Entities/2-1-5-index.html)                        | 60분      |
| 14:10~14:30 | 07     | [Threshold](./2-2-event-analytics/2-2-1-Thresholds/2-2-1-index.html)                      | 20분      |
| 14:30~14:50 | 08     | [Multi-KPI Alerts](./2-2-event-analytics/2-2-2-Multi-KPI/2-2-2-index.html)                | 20분      |
|             |        | **10 Min Break Time**                                                                     |
| 15:00~15:20 | 09     | [Aggreation Policies](./2-2-event-analytics/2-2-3-AggregationPolicies/2-2-3-index.html)   | 20분      |
| 15:20~15:40 | 10     | [Anomaly Detection](./2-2-event-analytics/2-2-3-AggregationPolicies/2-2-3-index.html)     | 20분      |
| 15:40~16:00 | 11     | [Predictive Anlytics](./2-2-event-analytics/2-2-3-AggregationPolicies/2-2-3-index.html)   | 20분      |
| 16:00~16:30 | 12     | [Content Pack & Others](./2-2-event-analytics/2-2-3-AggregationPolicies/2-2-3-index.html) | 30분      |
