# 6. Review Agent Trace Data

## LLM Provider 구성 검토

Splunk Observability Cloud에는 대규모 언어 모델(LLM)을 연결할 수 있는 통합 기능이 포함되어 있습니다. Splunk는 이 연결을 사용하여 애플리케이션에서 생성된 LLM 응답의 의미론적 품질을 평가합니다.

이 통합 기능은 워크숍 구성에 이미 설정되어 있습니다.

구성을 보려면 데이터 관리 → 배포된 통합 으로 이동한 다음 범주 필터를 로 설정하세요 LLMs.

LLM 제공기관을 검색 하여 선택하세요. 다음과 같은 제공기관이 표시될 것입니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/LLMProviders.png)

제공업체를 클릭하여 `Azure OpenAI O11y Specialists` 세부 정보를 확인하세요.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/LLMProviderDetails.png)

이 조직에서는 샘플링 비율이 20% 로 설정되어 있습니다 . 즉, Splunk는 애플리케이션에서 생성된 LLM 응답의 평균 20% 에 대해 의미론적 품질을 평가합니다.

분당 평가 횟수 제한은 50회로 설정 되어 있습니다. 샘플링 속도와 속도 제한은 고객의 요구에 따라 조정할 수 있습니다. 샘플링 속도가 높을수록 더 많은 평가 데이터를 얻을 수 있지만, 토큰 사용량과 관련 비용도 증가합니다.

</br>

## AI 에이전트 모니터링 구성 검토

Splunk Observability Cloud에는 AI 에이전트 모니터링 관련 세부 정보를 저장하는 데 사용할 데이터 소스를 구성할 수 있는 페이지도 포함되어 있습니다. 선택 사항은 다음과 같습니다.

- 데이터 소스 – Splunk Observability Cloud
- 데이터 소스 – Splunk 로그

**[Settings] > [AI Agent Monitoring]** 으로 이동하면 이러한 설정을 확인할 수 있습니다 .

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AIAgentMonitoringConfiguration.png)

Splunk는 AI 에이전트 모니터링 관련 세부 정보를 저장하기 위해 Splunk Observability Cloud를 활용할 것을 권장합니다. 본 워크숍에서도 이 설정을 사용했습니다.

</br>

## AI 모니터링 권한 검토

LLM 대화 데이터의 민감한 특성을 고려하여, 이 정보에 대한 접근 및 보기 권한을 제어하기 위해 Splunk Observability Cloud에 `ai_monitoring` 라는 새로운 역할이 추가되었습니다

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AIMonitoringRole.png)

</br>

## Splunk Observability Cloud에서 추적 데이터 보기

Splunk Observability Cloud에서 **[APM] > [Service Map]** 으로 이동한 다음 본인 Environment가 필터 되어있는지 확인 합니다 (예: agentic-ai-shw-291e)

> [!TIP]
>
> 인스턴스 이름을 잊어버린 경우 `echo $INSTANCE` 명령어를 사용하세요.

다음과 같은 서비스 맵이 표시될 것입니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/ServiceMap.png)

서비스 동그라미를 클릭 후 표시되는 오른쪽 메뉴에서 그래프를 클릭 후 실행 속도가 느린 추적 항목 중 하나를 선택하세요. 다음 예시와 같은 화면이 나타날 것입니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/Trace.png)

**Agent Flow 섹션**에 담당자 이름(예: 코디네이터, 항공편 전문가 등) 이 표시되지 않는다는 점에 유의하세요 .

아래로 스크롤하여 추적 기록에서 AI 상호 작용 중 하나를 클릭해 보겠습니다. 여기에서 프롬프트와 응답이 캡처된 것을 확인할 수 있습니다. 또한 이 추적 기록에 대한 의미론적 품질 평가 결과도 볼 수 있습니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/TraceDetails.png)

[APM] > [AI Agents] 메뉴로 이동하여 아래 내용을 확인합니다. 본인 Environment가 필터 되어있는지 확인 합니다 (예: agentic-ai-shw-291e)

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/Agents.png)

</br>

---

**Module 6. Review Agent Trace Data DONE!**
