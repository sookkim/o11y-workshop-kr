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
