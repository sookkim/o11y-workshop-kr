# Monitoring Agentic AI Applications

Splunk Observability Cloud를 활용하여 Agentic AI 애플리케이션을 모니터링하는 방법을 다루는 워크샵입니다.

원활한 워크샵이 되도록 시간과 아젠다를 참고 부탁드립니다

</br>

## Pre-Requisite

본 워크샵은 아래 환경이 마련되어 있어야 진행이 가능합니다

- Splunk4ninja - observability

</br>

## 교육 목표

Splunk Observability for AI는 AI 애플리케이션 스택의 성능, 품질, 보안 및 비용을 모니터링합니다. 다음 기능을 포함합니다.

- AI 에이전트 모니터링은 LLM 및 에이전트 기반 애플리케이션의 성능, 품질, 보안 및 비용을 모니터링합니다.
- AI 인프라 모니터링은 AI 인프라의 상태, 가용성 및 소비량(또는 사용량)을 모니터링합니다.

이 워크숍에서는 Splunk Observability Cloud에서 이러한 기능을 배포하고 활용하는 실습 경험을 제공합니다. 다음 내용이 포함됩니다.

- Azure 계정을 Splunk Observability Cloud 에 연결하여 AI 인프라 관련 지표를 수집하는 방법을 이해합니다 .
- AI 인프라와 관련된 독창적인 대시 보드 및 내비게이터 를 살펴봅니다.
- LangChain 과 LangGraph를 사용하여 구축된 에이전트형 AI 애플리케이션의 아키텍처를 검토합니다 .
- 에이전트 기반 AI 애플리케이션을 배포하고 OpenTelemetry를 사용하여 계측하는 연습을 해보세요 .
- Splunk Observability Cloud에서 메트릭, 추적 및 로그를 사용하여 에이전트 성능을 이해하는 방법을 살펴봅니다 .
- 에이전트 기반 AI 애플리케이션을 수정하여 도구 호출 과 에이전트를 사용하도록 연습해 보세요 .
- Splunk Observability Cloud를 사용하여 의미론적 품질 평가를 통해 애플리케이션에 품질 문제를 추가하고 이를 감지하는 방법을 연습해 보세요 .
- Splunk Observability Cloud를 사용하여 애플리케이션 및 보안 위험 에 대한 AI 방어 계측을 추가하고 이를 탐지하는 연습을 하십시오 .

</br>

## Contents

| 시간                        | 인덱스 | 내용                                                                                                | 예상 시간 |
| --------------------------- | ------ | --------------------------------------------------------------------------------------------------- | --------- |
| 10:00~10:20                 | 00     | Overview & Pre-requisite                                                                            | 20분      |
| 10:20~10:30                 | 01     | [Review Azure OpenAI Metrics, Dashboards, and Navigators](./3-1-1-AIMetricsReview/3-1-1-index.html) | 10분      |
| 10:30~10:40                 | 02     | [Deploy the OpenTelemetry Collector](./3-1-2-DeployOpenTelemetryCollector/3-1-2-index.html)         | 10분      |
| 10:40~11:00                 | 03     | [Agentic AI Application Architecture](./3-1-3-agenticAIappArch/3-1-3-index.html)                    | 20분      |
| **10 Min Break time!**      |
| 11:10~11:20                 | 04     | [Deploy Agentic AI Application](./3-1-4-DeployAgenticAI/3-1-4-index.html)                           | 10분      |
| 11:20~11:35                 | 05     | [Instrument the Agentic AI Application](./3-1-5-InstrumentAIApp/3-1-5-index.html)                   | 15분      |
| 11:35~11:40                 | 06     | [Review Agent Trace Data](./3-1-6-ReveiwAPMData/3-1-6-index.html)                                   | 5분       |
| **1 Hr 20 min Lunch time!** |
| 13:00~13:20                 | 07     | [Add Tool Calls](./3-1-7-AddToolCalls/3-1-7-index.html)                                             | 20분      |
| 13:20~13:30                 | 08     | [Detect Quality Issue](./3-1-8-DetectQualityIssue/3-1-8-index.html)                                 | 10분      |
| 13:30~13:40                 | 09     | [Add AI Defense Instrumentation](./3-1-9-AIDefence/3-1-9-index.html)                                | 10분      |
| 13:40~14:00                 | 10     | [Detect Security Risks](./3-1-10-SecurityIssue/3-1-10-index.html)                                   | 20분      |

## Set up your Hands-on Environment

오늘 핸즈온 트레이닝을 진행하기 위해서는 각자의 로컬환경에 아래 내용이 준비되어 있어야 합니다.

- 유무선 인터넷 접속
- SSH 접속 가능한 터미널
- Observability Cloud 핸즈온 환경 접속 정보
- Splunk Observability Cloud - Splunk Korea organization 으로 접속
  <img src="../../images/1-ninja-kr/1-invi.jpg" width="600" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

### SSH 접속을 테스트 해 봅시다

1. 위 사전 준비 정보 중 핸즈온 환경 접속 정보 파일을 열어 봅니다
2. **ssh** 컬럼에 쓰여진 명령어를 그대로 복사하여 터미널에 붙여넣은 후 패스워드는 **sshPassword** 칼럼을 복사하여 입력합니다

   ```bash
   ]$ ssh -p 2222 splunk@54.180.147.112

    Warning: Permanently added '[54.180.147.112]:2222' (ED25519) to the list of known hosts.

    ░█▀▀▀█ ░█─░█ ░█▀▀▀█ ░█──░█
    ─▀▀▀▄▄ ░█▀▀█ ░█──░█ ░█░█░█
    ░█▄▄▄█ ░█─░█ ░█▄▄▄█ ░█▄▀▄█

    splunk@54.180.147.112's password: <여기에 패스워드 입력>

   ```

    </br>

    <img src="../../images/1-ninja-kr/1-1-terminal.jpg" width="800" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

---

**Module 0. Set up your Hands-on Environment DONE!**
