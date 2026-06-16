# 1. Review Azure OpenAI Metrics, Dashboards, and Navigators

본 워크숍에서는 Azure에서 실행되는 OpenAI 모델을 사용합니다.

Azure OpenAI 애플리케이션이 Splunk Observability Cloud로 메트릭을 전송하도록 구성하면 Azure OpenAI 애플리케이션의 성능을 모니터링할 수 있습니다.

워크샵 환경은 이미 [공식 문서](https://help.splunk.com/en/splunk-observability-cloud/observability-for-ai/splunk-ai-infrastructure-monitoring/set-up-ai-infrastructure-monitoring/azure-openai) 에 설명된 단계를 따라 Azure 계정을 Splunk Observability Cloud 워크샵 인스턴스와 통합했습니다.

Azure OpenAI 메트릭이 포함되도록 하기 위해 연결이 `Cognitive Services` 에서 메트릭을 가져오도록 구성되었습니다

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AzureConnection.png)
</br>

## Azure OpenAI 메트릭

Azure OpenAI에 대해 여러 가지 지표가 수집됩니다.

- 처리된 프롬프트 토큰
- 생성된 토큰
- AzureOpenAIRequests
- AzureOpenAITimeToResponse
- AzureOpenAIAvailabilityRate
- AzureOpenAITokenPerSecond
- AzureOpenAIContextTokensCacheMatchRate

Splunk O11y Cloud 화면에서 **[Metrics] > [Metric Finder]** 로 이동한 다음, 해당 `ProcessedPromptTokens` 메트릭을 검색 하고 **[View in chart]** 를 클릭합니다.

> [!NOTE] </br>
> 이 [링크](https://app.us1.signalfx.com/#/chart/v2/new?template=default&filters=sf_metric:ProcessedPromptTokens) 를 따라가면 바로 확인 할 수 있습니다

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/ProcessedPromptTokensMetric.png)

</br>

## Azure OpenAI Navigator

Splunk Observability Cloud는 OpenTelemetry 생성형 AI 클라이언트 및 모델 서버 메트릭을 수집하여 Azure에서 실행되는 토큰 사용량과 Open AI 대규모 언어 모델(LLM) 서비스를 추적합니다.

Azure OpenAI 탐색기를 사용하여 이러한 메트릭을 볼 수 있습니다. **[Infrastructure] > [Overview] -> [AI Framework]** 로 이동한 다음 Azure OpenAI를 클릭합니다 .

'테이블' 탭이 선택되어 있는지 확인한 다음 테이블에서 `gpt-4.1-mini` 모델을 클릭합니다 . 다음과 같은 탐색기가 표시될 것입니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AzureOpenAINavigator.png)

</br>

## Azure OpenAI 대시보드

Splunk Observability Cloud는 Azure OpenAI용 내장 대시보드를 제공하여 다음과 같은 사항을 즉시 확인할 수 있도록 해줍니다.

- 활성 Azure OpenAI 모델
- 토큰 사용
- 호출 지연 시간
- 모델에 의한 호출
- 첫 번째 바이트 수신 시간
- 총 응답 시간
- 모델 재고 여부
- 요청당 토큰 수
- 모델이 처리한 토큰 수
- 모델이 생성한 토큰 수

대시보드 로 이동한 다음 Azure OpenAI를 검색하여 대시보드를 확인하세요.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AzureOpenAIDashboard.png)

</br>

---

**Module 1. AI Metrics Review DONE!**
