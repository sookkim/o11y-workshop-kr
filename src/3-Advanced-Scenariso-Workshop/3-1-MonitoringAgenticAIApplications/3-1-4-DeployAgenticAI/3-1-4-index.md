# 3. Deploy Agentic AI Application

## 에이전트 기반 AI 애플리케이션 배포 (Linux)

먼저 Linux EC2 인스턴스에서 애플리케이션을 직접 실행해 보겠습니다.

### 환경변수 확인

EC2 인스턴스에는 애플리케이션이 Azure에 호스팅된 OpenAI 모델(Lite LLM 프록시를 통해)에 연결하는 방법을 알려주는 다음과 같은 사전 설정된 환경 변수가 포함되어 있습니다.

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`

</br>

### 가상환경 구성

다음으로 파이썬 가상 환경을 생성하고 애플리케이션 실행에 필요한 패키지를 설치하겠습니다.

```bash
cd ~/workshop/agentic-ai/base-app
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

</br>

### 애플리케이션 실행

이제 다음 명령어를 사용하여 애플리케이션을 실행할 수 있습니다.

```bash
python3 main.py
```

</br>

### 애플리케이션 테스트

EC2 인스턴스에 연결된 두 번째 터미널 세션을 열고 다음 명령을 실행하여 애플리케이션을 테스트하십시오. 제안된 여행 계획이 JSON 형식으로 반환되어야 합니다.

애플리케이션이 정상적으로 작동하는 것을 확인했으면 첫 번째 터미널로 돌아가서 `Ctr + C` 를 눌러 애플리케이션을 종료하십시오.

</br>

## 에이전트 기반 AI 애플리케이션(Kubernetes) 배포

이제 애플리케이션이 정상적으로 작동하므로 쿠버네티스에 배포해 보겠습니다.

### Docker 이미지 빌드

`~/workshop/agentic-ai/base-app/` 에 있는 Dockerfile을 사용하여 애플리케이션용 Docker 이미지를 빌드합니다. 다음 명령을 실행하여 이미지를 빌드하세요.

```bash
cd ~/workshop/agentic-ai/base-app

docker build --platform linux/amd64 -t localhost:9999/agentic-ai-app:base-app .

docker push localhost:9999/agentic-ai-app:base-app
```

</br>

### 애플리케이션 네임스페이스 생성

애플리케이션을 호스팅할 새 네임스페이스를 만들어 보겠습니다.

```bash
kubectl create ns travel-agent
```

</br>

### OpenAI 자격 증명으로 Secret을 생성

OpenAI 엔드포인트와 키를 저장하기 위해 Kubernetes 시크릿을 사용하겠습니다.

```bash
{ [ -z "$OPENAI_API_KEY" ] || \
  [ -z "$OPENAI_BASE_URL" ]; } && \
  echo "Error: Missing variables" || \
  kubectl create secret generic openai-api \
  -n travel-agent \
  --from-literal=openai-api-endpoint=$OPENAI_BASE_URL \
  --from-literal=openai-api-key=$OPENAI_API_KEY
```

> [!TIP]
>
> 'Missing variables' 오류 메시지가 표시되면 이 명령을 실행하기 전에 OpenAI API에 연결하기 위한 환경 변수를 수동으로 정의해야 합니다.

</br>

### Kubernetes 매니페스트 파일을 사용하여 애플리케이션 배포

미리 빌드된 Kubernetes 매니페스트는 `~/workshop/agentic-ai/base-app/k8s.yaml` 이라는 이름의 파일에서 찾을 수 있습니다

```bash
kubectl apply -f ~/workshop/agentic-ai/base-app/k8s.yaml
```

</br>

### 애플리케이션이 실행 중인지 확인

다음 명령어를 사용하여 애플리케이션 파드의 상태가 `Running` 인지 확인하십시오

```bash
kubectl get pods -n travel-agent

NAME                                        READY   STATUS    RESTARTS   AGE
travel-planner-langchain-5dd866c97b-lcwl6   1/1     Running   0          65s
```

</br>

### Kubernetes에서 애플리케이션 테스트

다음 명령어를 실행하여 애플리케이션을 테스트하십시오.

```bash
curl http://travel-planner.localhost/travel/plan \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Seattle",
    "destination": "Tokyo",
    "user_request": "We are planning a week-long trip to Seattle from Tokyo. Looking for boutique hotel, business-class flights and unique experiences.",
    "travelers": 2
  }'
```

</br>

## 문제 해결

문제 해결이 필요한 경우 다음 명령어를 사용하여 애플리케이션 로그를 확인하세요.

```bash
kubectl logs -l app=travel-planner-langchain -n travel-agent -f
```

</br>

---

**Module 4. Deploy Agentic AI Application DONE!**
