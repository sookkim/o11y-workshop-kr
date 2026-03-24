# 1. Monolith Workshop : 실습 환경 준비하기

<!--
## Docker 설치

```bash
# 패키지 업데이트
sudo apt update

# 필수 패키지 설치
sudo apt install ca-certificates curl gnupg

# Docker 공식 GPG 키 추가
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Docker 저장소 추가
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 저장소 다시 업데이트
sudo apt update

# Docker 설치
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker 설치 확인
docker --version

# (선택) sudo 없이 docker 명령어 사용하려면
sudo usermod -aG docker $USER
# 그 후에 터미널 재접속하거나 reboot

```

-->

</br>

## Contents

| 시간        | 인덱스 | 내용                                                                                      | 예상 시간 |
| ----------- | ------ | ----------------------------------------------------------------------------------------- | --------- |
| 14:00~14:10 | 0      | [개요 설명 & 실습 환경 접속](./1-0-requirements/1-0-index.html)                           | 10분      |
| 14:10~14:30 | 1      | [OTel Collector 설치 (**IM**)](./1-1-DeployOpenTelemetryCollector/1-1-index.html)         | 30분      |
| 14:30~14:50 | 2      | [Pet Clinic JAVA APP 구동시키기](./1-2-DeployJavaAPP/1-2-index.html)                      | 20분      |
| 14:50~15:20 | 3      | [Java Instrumentation (**APM**)](./1-3-InstrumentJavaAPPwithOpenTelemetry/1-3-index.html) | 30분      |
| 15:20~15:40 | 9      | [Log collection to Splunk Cloud (**Log**)](./1-9-CollectLogs/1-9-index.html)              | 20분      |
| 15:40~15:50 | 13     | [Related Content 로 통합 분석하기](./1-13-RelatedContents/1-13-index.html)                | 20분      |
|             |        | **20 Min Break Time**                                                                     |
| 16:10~16:20 | 10     | Set Log Observer connector                                                                | 10분      |
| 16:20~17:00 | 11     | Challenge : MySQL Receiver 추가하기                                                       | 40분      |

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
- Observability Cloud 핸즈온 환경 접속 정보 - [링크 클릭](https://cisco.box.com/s/zi4ws67vlkeaqbiw39t7ochkpgnc7q9c)
- Splunk Observability Cloud - Splunk Korea organization 으로 접속
- Splunk Cloud 핸즈온 환경 접속 정보 - [링크 클릭](https://cisco.box.com/s/j0l2wwfbiuid0jsw5709cjo0zoke7hvk)

</br>

### 오늘은 실습 환경은 이렇게 되어 있습니다

이 글에서는 샘플 Java 애플리케이션(**Spring PetClinic**)을 복제(다운로드)하는 방법과 컴파일, 패키징, 실행하는 방법을 단계별로 설명합니다.

애플리케이션이 실행되면 Splunk APM 제품에서 사용하는 Java 2.x 자동 검색 및 구성을 통해 메트릭, 추적 및 로그를 즉시 확인할 수 있습니다.

그다음, Splunk OpenTelemetry Javascript Libraries(RUM)를 사용하여 PetClinic의 최종 사용자 인터페이스(애플리케이션에서 렌더링되는 HTML 페이지)를 계측하고, 최종 사용자가 수행하는 모든 개별 클릭 및 페이지 로드에 대한 RUM 추적을 생성합니다.

마지막으로, PetClinic 애플리케이션 로그에 추적 메타데이터가 자동으로 삽입되어 생성된 로그를 확인합니다.

</br>

<img src="https://splunk.github.io/observability-workshop/en/ninja-workshops/1-automatic-discovery/1-petclinic-monolith/images/petclinic-exercise.png" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

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

**Module 1-0. Pre-Requisites : 실습 환경 준비하기 DONE!**
