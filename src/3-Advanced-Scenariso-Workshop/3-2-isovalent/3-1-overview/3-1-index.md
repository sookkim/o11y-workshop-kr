# Isovalent Overview & Prerequisite

아이소밸런트 엔터프라이즈 플랫폼은 eBPF(Extended Berkeley Packet Filter) 기술을 기반으로 구축된 세 가지 핵심 구성 요소로 이루어져 있습니다.

### Cilium

클라우드 네이티브 CNI 및 네트워크 보안

- Kubernetes를 위한 eBPF 기반 네트워킹 및 보안
- kube-proxy를 고성능 eBPF 데이터 경로로 대체합니다.
- AWS ENI 모드에 대한 네이티브 지원(Pod가 VPC IP 주소를 할당받음)
- L3-L7에서의 네트워크 정책 시행
- 투명한 암호화 및 로드 밸런싱

</br>

### Hubble

네트워크 관찰 가능성

- Cilium의 eBPF 가시성을 기반으로 구축되었습니다.
- 실시간 네트워크 흐름 모니터링
- L7 프로토콜 가시성(HTTP, DNS, gRPC, Kafka)
- 흐름 내보내기 및 이력 데이터 저장(Timescape)
- 포트 9965에서 노출되는 메트릭

</br>

### Tetragon

런타임 보안 및 관찰 가능성

- eBPF 기반 런타임 보안
- 프로세스 실행 모니터링
- 시스템 호출 추적
- 파일 접근 추적
- 포트 2112의 보안 이벤트 메트릭

</br>

## Architecture

<img src="../../images/isovalent/3-1-architecture.jpg" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

## Key Components

| Component       | Service Name    | Port | Purpose                              |
| --------------- | --------------- | ---- | ------------------------------------ |
| Cilium Agent    | cilium-agent    | 9962 | CNI, network policies, eBPF programs |
| Cilium Envoy    | cilium-envoy    | 9964 | L7 proxy for HTTP, gRPC              |
| Cilium Operator | cilium-operator | 9963 | Cluster-wide operations              |
| Hubble          | hubble-metrics  | 9965 | Network flow metrics                 |
| Tetragon        | tetragon        | 2112 | Runtime security metrics             |

</br>

## eBPF 사용의 이점

- 고성능 : 최소한의 오버헤드로 Linux 커널에서 실행됩니다.
- 안전성 : 검증 도구는 프로그램이 안전하게 실행되도록 보장합니다.
- 유연성 : 커널 모듈 없이 동적 계측 가능
- 가시성 : 네트워크 및 시스템 동작에 대한 심층적인 통찰력

_이 통합을 통해 기존 CNI 플러그인으로는 불가능했던 수준의 Kubernetes 네트워킹 가시성을 확보할 수 있습니다._

</br>

## Pre-requisite

### SSH 접속을 테스트 해 봅시다

1. 핸즈온 환경 접속 정보 파일을 열어 봅니다
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

### 필요한 패키지가 모두 인스톨 되어있는지 확인합니다

```bash
kubectl version --client

aws --version

helm version
```

이 실습에 필요한 eksctl 은 설치되어있지 않으므로 아래 명령어를 통해 설치를 진행합니다

```bash
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo install -m 0755 /tmp/eksctl /usr/local/bin && rm /tmp/eksctl

eksctl version
```

</br>

---

**Module 1. Isovalent Overview & Prerequisite DONE!**
