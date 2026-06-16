# 5. Instrument the Agentic AI Application

에이전트 기반 AI 애플리케이션에 OpenTelemetry를 적용하고 Kubernetes에 배포하려면 몇 가지 단계가 필요합니다.

1. 계측 패키지를 `requirements.txt` 파일에 추가합니다.
2. `opentelemetry-instrument` 를 이용하여 애플리케이션을 호출하는 Dockerfile을 업데이트
3. 계측 패키지를 사용하여 새 Docker 이미지를 빌드
4. 환경 변수를 사용하여 Kubernetes 매니페스트를 업데이트
5. Kubernetes 매니페스트를 배포

</br>

## Instrument 패키지 추가

`~/workshop/agentic-ai/base-app/requirements.txt` 파일을 편집 모드로 열고 파일 하단에 다음 패키지를 추가하면 됩니다

```bash
vi ~/workshop/agentic-ai/base-app/requirements.txt
```

```txt
splunk-opentelemetry==2.8.0
splunk-otel-instrumentation-langchain==0.1.7
splunk-otel-genai-emitters-splunk==0.1.7
splunk-otel-util-genai==0.1.9
opentelemetry-instrumentation-flask==0.59b0
```

이러한 패키지는 다음과 같이 설명할 수 있습니다.

- **splunk-opentelemetry**: Splunk APM에 분산 추적을 캡처하고 보고하도록 Python 애플리케이션을 계측하는 OpenTelemetry Python의 Splunk 배포판입니다.
- **splunk-otel-instrumentation-langchain** : LangChain LLM/chat 워크플로우를 위한 OpenTelemetry 계측 기능을 제공합니다.
- **splunk-otel-genai-emitters-splunk** : Splunk 플랫폼에서 저장 및 필터링을 최적화하기 위해 평가 결과 로그에 대한 Splunk 스키마용 이미터를 제공합니다.
- **splunk-otel-util-genai** : OpenTelemetry의 의미 규칙을 사용하여 생성형 AI 워크로드의 계측을 용이하게 하는 API 및 데이터 유형을 제공하는 유틸리티 함수를 포함합니다.
- **opentelemetry-instrumentation-flask** Flask 애플리케이션에서 웹 요청을 추적하기 위해 OpenTelemetry WSGI 미들웨어를 기반으로 구축되었습니다.

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/requirements.txt ~/workshop/agentic-ai/app-with-instrumentation/requirements.txt
> ```

</br>

## Dockerfile 업데이트

다음으로 OpenTelemetry 계측을 활성화해야 합니다. 이를 위해 Dockerfile을 수정하여 애플리케이션이 `opentelemetry` 옵션으로 시작되도록 합니다. Dockerfile을 편집 모드로 열고 마지막 줄을 다음과 같이 수정하십시오.

```bash
vi ~/workshop/agentic-ai/base-app/Dockerfile
```

```Dockerfile
# Run the server with instrumentation
CMD ["opentelemetry-instrument", "python", "main.py"]
```

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/Dockerfile ~/workshop/agentic-ai/app-with-instrumentation/Dockerfile
> ```

</br>

### 업데이트된 Docker 이미지 빌드

새로운 태그가 포함된 업데이트된 Docker 이미지를 빌드합니다.

```bash
cd ~/workshop/agentic-ai/base-app
docker build --platform linux/amd64 -t localhost:9999/agentic-ai-app:app-with-instrumentation .
docker push localhost:9999/agentic-ai-app:app-with-instrumentation
```

</br>

### ConfigMap 정의

Kubernetes에 애플리케이션을 배포할 때, 텔레메트리(메트릭, 트레이스, 로그)가 명확하고 고유한 환경 식별자와 함께 Splunk Observability Cloud로 전송되도록 하고 싶습니다. 이렇게 하면 여러 배포 환경 간의 데이터를 쉽게 필터링, 비교 및 ​​문제 해결할 수 있습니다.

이를 위해 OpenTelemetry 리소스 속성에 `deployment.environment`이라는 이름을 지정합니다. 값을 하드코딩하는 대신 EC2 인스턴스에 이미 존재하는 환경 변수에서 값을 가져옵니다. 이렇게 하면 각 배포에 올바른 환경 이름이 자동으로 태그됩니다.

이 설정을 Kubernetes ConfigMap에 저장하고, 나중에 이를 환경 변수로 애플리케이션 파드에 주입할 수 있습니다.

다음 명령어를 사용하여 ConfigMap을 생성하세요.

```bash
kubectl create configmap instance-config \
--from-literal=OTEL_RESOURCE_ATTRIBUTES=deployment.environment=agentic-ai-$INSTANCE \
-n travel-agent
```

이 기능의 역할은 다음과 같습니다.

- `OTEL_RESOURCE_ATTRIBUTES` : OpenTelemetry에서 요구하는 환경 변수를 정의합니다.
- `deployment.environment` 의 값을 $INSTANCE 에 환경 변수로 저장 된 인스턴스 이름을 `agentic-ai-shw-1c43` 와 같은 형태의 값으로 설정됩니다
- travel-agent 네임스페이스에 ConfigMap을 생성합니

다음 단계에서 Kubernetes 배포를 구성할 때 이 ConfigMap을 참조할 것입니다.

</br>

### 쿠버네티스 매니페스트 업데이트

특히 OpenTelemetry 계측 및 AI 에이전트 모니터링에는 계측 데이터의 수집, 처리 및 내보내기 방식을 정의하는 여러 환경 변수를 설정해야 합니다.

~/workshop/agentic-ai/base-app/k8s.yaml 파일을 편집 모드로 열고 계측에 사용할 이미지를 사용하도록 이미지 태그를 업데이트합니다.

```bash
vi ~/workshop/agentic-ai/base-app/k8s.yaml
```

```yaml
image: localhost:9999/agentic-ai-app:app-with-instrumentation
```

그리고 같은 파일 내에서

#Begin: Add Environment Variables

#End: Add Environment Variables

내용 사이에 아래와 같은 환경변수 내용을 끼워 넣습니다

```yaml
# Begin: Add Environment Variables
# Service Name
- name: OTEL_SERVICE_NAME
  value: 'travel-planner'
# Additional OTEL configuration
- name: OTEL_RESOURCE_ATTRIBUTES
  valueFrom:
    configMapKeyRef:
      name: instance-config
      key: OTEL_RESOURCE_ATTRIBUTES
- name: SPLUNK_OTEL_AGENT
  valueFrom:
    fieldRef:
      fieldPath: status.hostIP
- name: OTEL_EXPORTER_OTLP_ENDPOINT
  value: 'http://$(SPLUNK_OTEL_AGENT):4317'
- name: OTEL_EXPORTER_OTLP_PROTOCOL
  value: 'grpc'
- name: OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE
  value: 'DELTA'
- name: OTEL_PYTHON_EXCLUDED_URLS
  value: '^(https?://)?[^/]+(/health)?$'
- name: OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT
  value: 'true'
- name: OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT_MODE
  value: 'SPAN'
- name: OTEL_INSTRUMENTATION_GENAI_EMITTERS
  value: 'span_metric,splunk'
- name: SPLUNK_PROFILER_ENABLED
  value: 'true'
# End: Add Environment Variables
```

다음 환경 변수들은 에이전트 기반 AI 모니터링에 특화되어 있으며 다음과 같이 설명할 수 있습니다.

- `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` : OTLP 메트릭 익스포터가 출력되는 메트릭에 대해 누적 합계, 변화량 또는 메모리 사용량이 적은 시간적 데이터를 보고할지 여부를 결정합니다. DELTA 에이전트 기반 AI 모니터링에는 이 설정을 로 하는 것이 좋습니다.
- `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT` : Agentic AI 애플리케이션의 메시지 캡처를 활성화/비활성화하는 데 사용됩니다. 본 워크숍에서는 이 설정을 활성화했습니다
- `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT_MODESPAN` : 메시지를 캡처하는 방법을 정의합니다. 이번 워크숍에서는 span 이벤트 저장소를 사용하여 메시지가 캡처되도록 설정했습니다
- `OTEL_INSTRUMENTATION_GENAI_EMITTERS` : 워크숍을 위해 이 설정을 적용했습니다 span_metric,splunk. 이렇게 하면 스팬 데이터와 메트릭 데이터는 물론 Splunk 관련 기능까지 모두 수집할 수 있습니다.

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/k8s.yaml ~/workshop/agentic-ai/app-with-instrumentation/k8s.yaml
> ```

</br>

## 업데이트된 애플리케이션 배포

다음과 같이 매니페스트 파일을 사용하여 업데이트된 애플리케이션을 배포할 수 있습니다.

```bash
kubectl apply -f ~/workshop/agentic-ai/base-app/k8s.yaml
```

</br>

## Kubernetes에서 애플리케이션 테스트

새 애플리케이션 Pod가 성공적으로 시작되었고 이전 Pod가 더 이상 존재하지 않는지 확인하십시오.

```bash
kubectl get pods -n travel-agent

NAME                                        READY   STATUS        RESTARTS   AGE
travel-planner-langchain-5dd866c97b-lcwl6   1/1     Terminating   0          46m
travel-planner-langchain-dd598fff6-6m78x    1/1     Running       0          23s
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

</br>

---

**Module 5. Instrument the Agentic AI Application DONE!**
