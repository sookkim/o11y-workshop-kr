# 1. Microservice Workshop : 실습 환경 준비하기

</br>

## Contents

| 시간        | 인덱스 | 내용                                                                                          | 예상 시간 |
| ----------- | ------ | --------------------------------------------------------------------------------------------- | --------- |
| 14:00~14:10 | 0      | [개요 설명 & 실습 환경 접속](./1-1-index.html)                                                | 10분      |
| 14:10~14:30 | 1      | [OTel Collector 설치 (**IM**)](./1-1-1-DeployOpenTelemetryCollector/1-1-1-index.html)         | 30분      |
| 14:30~14:50 | 2      | [Pet Clinic JAVA APP 구동시키기](./1-1-2-DeployJavaAPP/1-1-2-index.html)                      | 20분      |
| 14:50~15:20 | 3      | [Java Instrumentation (**APM**)](./1-1-3-InstrumentJavaAPPwithOpenTelemetry/1-1-3-index.html) | 30분      |
| 15:20~15:40 | 4      | [Log collection to Splunk Cloud (**Log**)](./1-1-4-CollectLogs/1-1-4-index.html)              | 20분      |
| 15:40~15:50 | 5      | [Related Content 로 통합 분석하기](./1-1-5-RelatedContents/1-1-5-index.html)                  | 20분      |
|             |        | **20 Min Break Time**                                                                         |
| 16:10~16:20 | 10     | [Set Log Observer connector](./1-1-6-LogObserverConnector/1-1-6-index.html)                   | 10분      |
| 16:20~17:00 | 11     | [Challenge : MySQL Receiver 추가하기](./1-1-7-ChallengeReceiver/1-1-7-index.html)             | 40분      |

</br>

## Understanding What is Splunk Observability Cloud

<img src="../../images/1-ninja-kr/1-1-intro.jpg" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

<img src="../../images/1-ninja-kr/1-1-architecture.jpg" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

<img src="../../images/1-ninja-kr/1-1-design.png" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

## Set up your Hands-on Environment

오늘 핸즈온 트레이닝을 진행하기 위해서는 각자의 로컬환경에 아래 내용이 준비되어 있어야 합니다.

- 유무선 인터넷 접속
- SSH 접속 가능한 터미널
- Observability Cloud 핸즈온 환경 접속 정보 - [링크 클릭](https://cisco.box.com/s/zi4ws67vlkeaqbiw39t7ochkpgnc7q9c) **수정필요**
- Splunk Observability Cloud - Splunk Korea organization 으로 접속
  <img src="../../images/1-ninja-kr/1-invi.jpg" width="600" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

### 오늘은 실습 환경은 이렇게 되어 있습니다

본 워크숍의 목표는 Splunk의 Java 용 자동 검색 및 구성 기능에 대해 소개하는 것입니다.

워크샵 시나리오는 Kubernetes에 간단한 ( 계측되지 않은 ) Java 마이크로서비스 애플리케이션을 설치하여 구현됩니다.

기존 Java 기반 배포 환경에 대한 자동 검색 기능을 갖춘 Splunk OpenTelemetry Collector를 설치하는 간단한 단계를 따라하면 메트릭, 추적 및 로그를 Splunk Observability Cloud 로 전송하는 것

Spring PetClinic Java 애플리케이션은 프런트엔드와 백엔드 서비스로 구성된 간단한 마이크로서비스 애플리케이션입니다. 프런트엔드 서비스는 백엔드 서비스와 상호 작용하는 웹 인터페이스를 제공하는 Spring Boot 애플리케이션입니다. 백엔드 서비스는 MySQL 데이터베이스와 상호 작용하는 RESTful API를 제공하는 Spring Boot 애플리케이션입니다.

이 워크숍이 끝나면 Kubernetes에서 실행되는 Java 기반 애플리케이션의 자동 검색 및 구성을 활성화하는 방법에 대해 더 잘 이해하게 될 것입니다.

</br>

<img src="https://splunk.github.io/observability-workshop/en/ninja-workshops/1-automatic-discovery/2-petclinic-kubernetes/images/auto-instrumentation-java-diagram.png" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

### SSH 접속을 테스트 해 봅시다

1. 위 사전 준비 정보 중 핸즈온 환경 접속 정보 - [Observability Cloud](https://cisco.box.com/s/zi4ws67vlkeaqbiw39t7ochkpgnc7q9c) 파일을 열어 봅니다
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

**Module 0. Monolith Workshop : 실습 환경 준비하기 DONE!**
