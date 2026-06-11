# Isovalent Splunk Observability Cloud Integration 🐝

오늘 진행될 Isovalent Splunk Observability Cloud Integration 🐝 의 콘텐츠는 아래와 같습니다

원활한 워크샵이 되도록 시간과 아젠다를 참고 부탁드립니다

</br>

## Pre-Requisite

본 워크샵은 Splunk Show 의 아래 환경이 마련 된 워크샵을 미리 실행시켜야 진행이 가능합니다

- Splunk4Rookies - Observability
  - EKS 클러스터, VPC 및 EC2 인스턴스를 생성할 수 있는 권한이 있는 AWS 계정
  - 액세스 토큰이 포함된 Splunk Observability Cloud 계정
  - kubectl, eksctl 및 Helm 3.x

</br>

## 교육 목표

이 워크숍이 끝나면 여러분은 다음과 같은 결과를 얻게 될 것입니다:

- Cilium을 CNI로 사용하여 ENI 모드로 Amazon EKS를 배포합니다.
- L7 가시성을 통해 네트워크 관찰이 가능하도록 Hubble을 구성합니다.
- 런타임 보안 모니터링을 위해 Tetragon을 설치하세요.
- OpenTelemetry를 사용하여 eBPF 기반 메트릭을 Splunk Observability Cloud와 통합하세요.
- 통합 대시보드에서 네트워크 흐름, 보안 이벤트 및 인프라 지표를 모니터링하세요.
- eBPF 기반 관찰 가능성 및 kube-proxy 대체에 대해 알아보세요.

</br>

## Contents

| 시간        | 인덱스 | 내용                                                         | 예상 시간 |
| ----------- | ------ | ------------------------------------------------------------ | --------- |
| 10:00~10:20 | 00     | [Overview & Prerequisite](./3-1-overview/3-1-index.html)     | 20분      |
| 10:20~10:30 | 01     | [Set up EKS Cluster](./3-2-eksCluster/3-2-index.html)        | 10분      |
| 10:30~10:40 | 02     | [Cilium Installation](./3-3-ciliumInstall/3-3-index.html)    | 10분      |
| 10:40~10:50 | 03     | [Splunk Integration](./3-4-splunkIntegration/3-4-index.html) | 10분      |
| 11:00~11:30 | 04     | [Varification]                                               | 30분      |
