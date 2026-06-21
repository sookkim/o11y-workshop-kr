# 9. Add AI Defense Instrumentation

Splunk Observability Cloud는 [Cisco AI Defense](https://www.cisco.com/site/us/en/products/security/ai-defense/index.html) 와 통합되어 AI 에이전트의 런타임 시 감지된 보안 및 개인정보 보호 위험 에 대한 통합을 제공하므로 한 곳에서 성능과 위험을 모니터링할 수 있습니다.

이는 Splunk AI 보안 모니터링 이라고 하며 다음과 같은 기능을 제공합니다.

- Prompt injection 및 개인 식별 정보 유출(PII Risks)과 같은 보안 및 개인정보 보호 위험이 감지된 에이전트, 상호 작용 및 서비스를 식별
- 시간 경과에 따른 위험 추세와 지연 시간, 오류 및 기타 성능 지표를 추적
- 트레이스 내용 상 보안에 취약한 내용을 구체적인 질문과 답변으로 나누어 감지

이 섹션에서는 에이전트 기반 AI 애플리케이션에 AI Defense 통합을 추가하고 Splunk Observability Cloud에서 결과 데이터를 검토합니다.

</br>

## 이러한 기능이 어떻게 동작하나요?

Splunk AI 보안 모니터링은 Python 기반 AI 에이전트의 보안 및 개인정보 보호 위험 트레이스를 자동으로 계측하는 라이브러리인 `opentelemetry-instrumentation-aidefense` 를 제공합니다.

이 라이브러리는 AI 에이전트가 LLM(예: OpenAI) 및 오케스트레이션 프레임워크(예: LangChain)에 대해 수행하는 호출에 보안 원격 측정 데이터를 캡처하고 첨부하여 모든 프롬프트와 응답이 보안 가드레일에 대해 감사되고 통합된 OpenTelemetry 추적에 기록되도록 합니다.

이는 `gen_ai.security.event_id attribute` 를 LLM 또는 워크플로 스팬에 해당 데이터를 추가하는 방식으로 이루어집니다.

</br>

## SDK vs. Gateway Mode

이 `opentelemetry-instrumentation-aidefense` 라이브러리는 SDK 모드 또는 게이트웨이 모드로 작동할 수 있습니다.

- **SDK 모드**를 사용하면 개발자는 inspect_prompt() 를 이용해 명시적인 보안 검사를 추가할 수 있습니다. 이 옵션은 보안 검사 구현 방식과 문제 해결 방식을 완벽하게 제어하려는 개발자에게 가장 적합합니다.
- **게이트웨이 모드**를 사용하면 LLM 호출이 Cisco AI Defense Gateway를 통해 프록시되므로 애플리케이션 코드 변경이 필요하지 않습니다. 이 모드는 OpenAI, Anthropic 등과 같은 널리 사용되는 상용 LLM에서 지원됩니다.

본 워크숍에서는 Azure OpenAI의 SDK 모드를 활용합니다.

</br>

## Cisco AI Defense 통합 설정

첫 번째 단계는 [Cisco AI Defense 와의 통합](https://help.splunk.com/en/splunk-observability-cloud/observability-for-ai/splunk-ai-security-monitoring/set-up-an-integration-with-cisco-ai-defense) 을 설정하는 것입니다.

Splunk Observability Cloud 화면에서 **[Data Management] -> [Deployed Integrations]** 으로 이동하여 검색하면 AI Defense이 통합이 이미 구성되어 있는 것을 확인할 수 있습니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AIDefenseConfig.png)

</br>

## Instrument 패키지 추가

다음으로, 몇 가지 계측 패키지를 설치해야 합니다. 이를 위해 `~/workshop/agentic-ai/base-app/requirements.txt` 파일을 편집 모드로 열고 다음 패키지를 추가하면 됩니다.

```txt
# AI Defense instrumentation (Gateway Mode support in v0.2.0+)
splunk-otel-instrumentation-aidefense>=0.2.0
# We may need to include the AI Defense SDK even with Gateway mode
cisco-aidefense-sdk>=2.0.0
# HTTP client (httpx is required for Gateway Mode to work)
httpx>=0.24.0
```

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/requirements.txt ~/workshop/agentic-ai/app-with-ai-defense/requirements.txt
> ```

</br>

## AI Defence SDK 임포트

애플리케이션을 수정하여 에이전트에 Cisco AI Defense 보호 기능을 추가해 보겠습니다.

`~/workshop/agentic-ai/base-app/main.py` 파일을 편집 모드로 열고 `Begin: Initialize AI Defense` 와 `End: Initialize AI Defense` 줄 사이에 AI Defense 보호 기능을 임포트하여 활성화하세요

```python
# Begin: Initialize AI Defense

from aidefense.runtime import agentsec
agentsec.protect(
    api_mode={
        "llm": {
            "mode": "monitor",    # "enforce" to block violations, "monitor" to log only
            "endpoint": os.environ["AI_DEFENSE_API_MODE_LLM_ENDPOINT"],
            "api_key": os.environ["AI_DEFENSE_API_MODE_LLM_API_KEY"],
        }
    }
)

# End: Initialize AI Defense
```

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/main.py ~/workshop/agentic-ai/app-with-ai-defense/main.py
> ```

</br>

### 업데이트된 Docker 이미지 빌드

새로운 태그가 포함된 업데이트된 Docker 이미지를 빌드합니다.

```bash
cd ~/workshop/agentic-ai/base-app
docker build --platform linux/amd64 -t localhost:9999/agentic-ai-app:app-with-ai-defense .
docker push localhost:9999/agentic-ai-app:app-with-ai-defense
```

</br>

### AI Defense 에 쓸 Secrete 생성

다음 명령을 실행하여 Cisco AI Defense 검사 API 키와 엔드포인트를 저장할 비밀 키를 생성하십시오.

```bash
kubectl create secret generic ai-defense-secret -n travel-agent --from-literal=ai-defense-inspection-api-key="$AI_DEFENSE_INSPECTION_API_KEY" --from-literal=ai-defense-inspection-api-endpoint="$AI_DEFENSE_INSPECTION_API_ENDPOINT"
```

</br>

### 쿠버네티스 매니페스트 업데이트

AI Defence 기능이 포함된 이미지로 업데이트하기 위해 `~/workshop/agentic-ai/base-app/k8s.yaml` 파일을 엽니다

```yaml
image: localhost:9999/agentic-ai-app:app-with-ai-defense
```

같은 파일 내에서 다음 환경 변수들을 환경 변수 섹션의 끝에 추가하십시오.

```yaml
- name: AI_DEFENSE_API_MODE_LLM_API_KEY
  valueFrom:
    secretKeyRef:
      name: ai-defense-secret
      key: ai-defense-inspection-api-key
- name: AI_DEFENSE_API_MODE_LLM_ENDPOINT
  valueFrom:
    secretKeyRef:
      name: ai-defense-secret
      key: ai-defense-inspection-api-endpoint
```

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/k8s.yaml ~/workshop/agentic-ai/app-with-ai-defense/k8s.yaml
> ```

</br>

### 업데이트된 애플리케이션 배포

다음과 같이 매니페스트 파일을 사용하여 업데이트된 애플리케이션을 배포할 수 있습니다.

```bash
kubectl apply -f ~/workshop/agentic-ai/base-app/k8s.yaml
```

</br>

### Kubernetes에서 애플리케이션 테스트

새 애플리케이션 Pod가 성공적으로 시작되었고 이전 Pod가 더 이상 존재하지 않는지 확인하십시오.

```bash
kubectl get pods -n travel-agent
```

다음으로, 다음 명령어를 실행하여 애플리케이션을 테스트하십시오.

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

지금은 애플리케이션이 정상적으로 작동하는지 확인하기만 하면 됩니다. 다음 섹션에서는 보안 위험 요소를 추가하고 이를 감지하는 방법을 보여드리겠습니다.

</br>

---

**Module 9. Add AI Defense Instrumentation DONE!**
