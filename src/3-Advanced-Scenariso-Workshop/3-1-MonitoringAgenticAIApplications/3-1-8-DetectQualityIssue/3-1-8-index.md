# 8. Detect Quality Issue

이전 섹션에서는 OpenTelemetry를 사용하여 애플리케이션을 계측하고 에이전트 응답의 의미론적 품질을 평가하도록 구성했습니다.

이 섹션에서는 애플리케이션에 몇 가지 품질 문제를 추가하여 Splunk Observability Cloud가 이러한 문제를 어떻게 감지하는지 살펴보겠습니다.

## Poisoned chat Wrapper 란?

이 섹션에서는 기존 `ChatModel`을 래핑하여 출력을 가로채고 '변조'하는 `PoisonedChatWrapper`라는 사용자 지정 클래스를 사용합니다. 이 접근 방식을 사용하는 이유는 OpenTelemetry 계측으로 캡처되기 전에 출력을 가로챌 수 있기 때문입니다.

이 과정이 궁금하다면 `poison_chat_wrapper.py` 파일을 참조하세요.

</br>

## Hotel Specialist 의 출력 오염시키기

다음으로, Hotel Specialist 에이전트가 이 래퍼를 사용하도록 수정하고 LLM 출력을 수정해 보겠습니다. 먼저, `~/workshop/agentic-ai/base-app/main.py` 파일에서 다음 import 문을 `Begin: Add Import Statements` 과 `End: Add Import Statements` 사이에 추가합니다

```python
from poison_chat_wrapper import PoisonedChatWrapper
```

그런 다음 `hotel_specialist_node` 함수의 정의를 다음과 같이 바꾸십시오.

> [!TIP]
>
> 편집기를 사용하여 여러 줄을 일괄 삭제하려면 vi 편집기에서 `i`키를 눌러 편집 모드를 활성화 한 다음,
>
> `Shift + V` 를 눌러 선택모드로 바꾸고
>
> 삭제할 모든 줄을 선택 한 다음
>
> 마지막으로 `d` 키를 눌러 선택한 줄을 삭제합니다.

</br>

```python
def hotel_specialist_node(
    state: PlannerState
) -> PlannerState:
    base_llm = _create_llm(
        "hotel_specialist", temperature=0.5, session_id=state["session_id"]
    )

    poisoned_llm = PoisonedChatWrapper(
        inner_llm=base_llm,
        poison_snippet="Note: I think this hotel is pretty terrible, best of luck if you stay there!"
    )

    agent = _create_react_agent(poisoned_llm, tools=[mock_search_hotels]).with_config(
        {
            "run_name": "hotel_specialist",
            "tags": ["agent", "agent:hotel_specialist"],
            "metadata": {
                "agent_name": "hotel_specialist",
                "session_id": state["session_id"],
            },
        }
    )
    step = (
        f"Recommend a boutique hotel in {state['destination']} between {state['departure']} "
        f"and {state['return_date']} for {state['travellers']} travellers."
    )

    # IMPORTANT: pass a proper list of messages (not stringified)
    messages = [
        SystemMessage(content="You are a hotel booking specialist. Provide concise options."),
        HumanMessage(content=step),
    ]

    result = agent.invoke({"messages": messages})

    final_message = result["messages"][-1]
    state["hotel_summary"] = (
        final_message.content
        if isinstance(final_message, BaseMessage)
        else str(final_message)
    )
    state["messages"].append(
        final_message
        if isinstance(final_message, BaseMessage)
        else AIMessage(content=str(final_message))
    )
    state["current_agent"] = "activity_specialist"
    return state
```

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/main.py ~/workshop/agentic-ai/app-with-quality-issue/main.py
> ```

</br>

## 업데이트된 Docker 이미지 빌드

새로운 태그가 포함된 업데이트된 Docker 이미지를 빌드합니다.

```bash
cd ~/workshop/agentic-ai/base-app
docker build --platform linux/amd64 -t localhost:9999/agentic-ai-app:app-with-quality-issue .
docker push localhost:9999/agentic-ai-app:app-with-quality-issue
```

</br>

### 쿠버네티스 매니페스트 업데이트

`~/workshop/agentic-ai/base-app/k8s.yaml` 파일을 편집 모드로 열고 품질 문제가 있는 이미지를 사용하도록 업데이트하세요.

```yaml
image: localhost:9999/agentic-ai-app:app-with-quality-issue
```

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

</br>

## Splunk Observability Cloud에서 데이터 보기

이제 Splunk Observability Cloud로 돌아가서 트레이스 모니터링 결과가 어떻게 보이는지 확인해 보겠습니다.

`hotel_specialist` 상담원의 `invoke_agent` 를 살펴보면, 추천한 호텔에 대해서 _pretty terrible_ 이라는 어휘를 쓰는 등 상담원에게 몇 가지 품질 문제가 있음을 알 수 있습니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/TraceWithQualityIssue.png)

</br>

---

**Module 8. Detect Quality Issue DONE!**
