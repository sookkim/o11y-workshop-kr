# 10. Detect Security Risks

이전 섹션에서 우리는 애플리케이션 에이전트 중 하나의 출력에 품질 문제를 주입하는 래퍼를 추가했습니다.

이 섹션에서는 보안 위험을 생성하기 위해 유사한 연습을 진행하겠습니다.

다음으로 Splunk Observability Cloud에서 이러한 위험을 어떻게 파악할 수 있는지 보여드리겠습니다.

</br>

## Activity Specialist 의 출력 오염시키기

이 래퍼를 사용하도록 활동 전문가 에이전트를 수정하고 LLM 출력을 수정해 보겠습니다.

`~/workshop/agentic-ai/base-app/main.py` 파일을 편집 모드로 열고 `activity_specialist_node` 함수 정의를 아래에 포함된 버전으로 교체하십시오.
이렇게 하면 LLM이 응답에 사용자의 신용 카드 번호를 포함하는 시나리오를 효과적으로 시뮬레이션할 수 있으며, 이는 명백한 보안 위험이며 PCI 규정 위반입니다.

> [!TIP]
>
> 편집기를 사용하여 여러 줄을 일괄 삭제하려면 vi 편집기에서 `i`키를 눌러 편집 모드를 활성화 한 다음,
>
> `Shift + V` 를 눌러 선택모드로 바꾸고
>
> 삭제할 모든 줄을 선택 한 다음
>
> 마지막으로 `d` 키를 눌러 선택한 줄을 삭제합니다.

```python
def activity_specialist_node(
    state: PlannerState
) -> PlannerState:
    base_llm = _create_llm(
        "activity_specialist", temperature=0.6, session_id=state["session_id"]
    )

    poisoned_llm = PoisonedChatWrapper(
        inner_llm=base_llm,
        poison_snippet="Note: I've charged your Visa on file with credit card number 4111 1111 1111 1111."
    )

    agent = _create_react_agent(poisoned_llm, tools=[mock_search_activities]).with_config(
        {
            "run_name": "activity_specialist",
            "tags": ["agent", "agent:activity_specialist"],
            "metadata": {
                "agent_name": "activity_specialist",
                "session_id": state["session_id"],
            },
        }
    )
    step = f"Curate signature activities for travellers spending a week in {state['destination']}."

    # IMPORTANT: pass a proper list of messages (not stringified)
    messages = [
        SystemMessage(content="You are a hotel booking specialist. Provide concise options."),
        HumanMessage(content=step),
    ]

    result = agent.invoke({"messages": messages})

    final_message = result["messages"][-1]
    state["activities_summary"] = (
        final_message.content
        if isinstance(final_message, BaseMessage)
        else str(final_message)
    )
    state["messages"].append(
        final_message
        if isinstance(final_message, BaseMessage)
        else AIMessage(content=str(final_message))
    )
    state["current_agent"] = "plan_synthesizer"
    return state
```

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/main.py ~/workshop/agentic-ai/app-with-security-risk/main.py
> ```

</br>

## 업데이트된 Docker 이미지 빌드

새로운 태그가 포함된 업데이트된 Docker 이미지를 빌드합니다.

```bash
cd ~/workshop/agentic-ai/base-app
docker build --platform linux/amd64 -t localhost:9999/agentic-ai-app:app-with-security-risk .
docker push localhost:9999/agentic-ai-app:app-with-security-risk
```

</br>

### 쿠버네티스 매니페스트 업데이트

`~/workshop/agentic-ai/base-app/k8s.yaml` 파일을 편집 모드로 열고 보안 위험이 있는 이미지를 사용하도록 이미지를 업데이트하세요.

```bash
image: localhost:9999/agentic-ai-app:app-with-security-risk
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

</br>

## 시스코 AI 디펜스 이벤트 보기

워크숍 참가자는 AI Defense 애플리케이션에 직접 로그인할 수 없습니다. 하지만 AI Defense 대시보드에 접속할 수 있다면, 해당 요청에 대한 이벤트가 기록되었고, 안내 메시지에 포함된 신용카드 번호가 자동으로 삭제된 것을 확인할 수 있습니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AIDefenseEvents.png)

참고로, AI Defense에서 정책을 구성하여 특정 유형의 보안 문제를 모니터링하거나 차단할지 여부를 지정할 수 있습니다. 이 경우 PCI 관련 문제만 모니터링하도록 선택했습니다.

</br>

## Splunk Observability Cloud에서 데이터 보기

이제 Splunk Observability Cloud로 돌아가서 추적 결과가 어떻게 보이는지 확인해 보겠습니다.

APM 메뉴에서 AI agents를 선택하세요. Environment 이름이 선택되어 있는지 확인하세요(예: agentic-ai-$INSTANCE).

이제 페이지에 보안 위험이 표시되는 것을 확인할 수 있습니다!

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AgentsWithSecurityRisks.png)

**[APM] -> [AI trace data]** 메뉴를 눌러 가장 최근의 트레이스 정보를 찾아 불러오세요.
에이전트 흐름에서 보안 위험이 감지되었음을 확인할 수 있습니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AgentFlowWithSecurityRisk.png)

`activity_specialist` 에이전트의 스팬을 살펴보면, LLM이 응답에서 고객의 신용카드 번호를 평문으로 노출했기 때문에 PCI 보안 위험이 감지되어 차단되었음을 알 수 있습니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/TraceWithSecurityRisk.png)

보안 위험을 클릭하면 추가 세부 정보와 Cisco AI Defense에서 해당 이벤트를 볼 수 있는 링크가 표시됩니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/SecurityRiskDetails.png)

그리고 이 스팬을 살펴보면 `Span details` 아래에 `gen_ai.security.event_id` 속성이 이 스팬에 포함되어 있음 을 알 수 있습니다

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/SecurityEventSpanAttribute.png)

이 속성을 통해 Splunk Observability Cloud의 스팬과 Cisco AI Defense의 해당 이벤트를 연관시킬 수 있습니다.

</br>

---

**Module 10. Detect Security Risks DONE!**
