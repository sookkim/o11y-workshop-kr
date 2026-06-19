# 7. Add Tool Calls

이전 섹션에서 우리는 에이전트가 새 에이전트 페이지나 추적 상단의 에이전트 흐름 에 나타나지 않는다는 것을 발견했습니다.

그 이유는 저희 애플리케이션이 현재 에이전트를 사용하지 않고 LLM을 직접 호출하기 때문입니다.

다시 말해, 현재 우리 앱은 마치 대본이 있는 연극과 같습니다. 모든 대사와 모든 동작이 코드에 적혀 있죠. LLM을 호출할 때는 단순히 특정 대사를 읽도록 요청하는 것뿐입니다. LLM은 스스로 선택을 하지 않기 때문에 AI 계측을 위한 관찰 가능성 도구는 이를 자율 에이전트로 인식하지 못합니다.

다음 섹션에서는 LLM에게 도구 와 해당 도구 사용 방법을 결정할 권한을 부여할 것입니다. 에이전트 기반 모델로 전환하면 LLM은 도구 호출을 생성하기 시작합니다 . OpenTelemetry 계측을 통해 이러한 상호 작용을 캡처하여 LLM의 사고 과정과 도구 사용 방식을 파악할 수 있으며, 각 에이전트는 Splunk Observability Cloud에 표시됩니다.

</br>

## 직접 호출 vs. 에이전트 추적

이러한 변경 사항을 적용하기 전에 LLM이 직접 호출될 때와 에이전트를 통해 호출될 때 추적 정보가 어떻게 수집되는지 자세히 살펴보겠습니다.

**직접 호출 추적**:

통화가 발생하면 llm.invoke()계측 시스템은 표준 "채팅" 또는 "완료" 스팬을 인식합니다. 시스템은 프롬프트와 응답을 기록합니다. 에이전트 프레임워크에서 관리하는 "루프" 또는 "도구 호출" 로직이 없기 때문에 Splunk Observability Cloud는 해당 스팬을 "에이전트"로 분류하는 데 필요한 메타데이터를 인식하지 못합니다.

**행위자의 흔적**:

에이전트(예: create_react_agent)를 사용하면 프레임워크는 실행을 특정 "에이전트" 및 "도구" 스팬으로 묶습니다. 이러한 스팬에는 OpenTelemetry에 "이것은 단순한 채팅이 아니라 특정 도구를 사용하는 추론 루프입니다."라고 알려주는 메타데이터가 포함되어 있습니다. 이것이 추적 시각화의 에이전트 페이지와 에이전트 흐름 다이어그램을 채우는 내용입니다.

</br>

## 백업 생성

`main.py` 파이썬 코드를 수정하기 전에 다음 명령어를 사용하여 파일을 백업하십시오 .

```bash
cp ~/workshop/agentic-ai/base-app/main.py ~/workshop/agentic-ai/base-app/main.py.bak
```

</br>

## Import 문 추가

`~/workshop/agentic-ai/base-app/main.py` 파일을 편집모드로 열어 `Begin: Add Import Statements` 아래 줄 과 `End: Add Import Statements` 줄 사이에 다음 import 문을 추가하세요

```python
# Begin: Add Import Statements

from langchain_core.tools import tool
from langchain.agents import (
    create_agent as _create_react_agent,  # type: ignore[attr-defined]
)

# End: Add Import Statements
```

</br>

## Tool 추가

같은 파일에서 `Begin: Tool Definitions` 아래 줄 과 `End: Tool Definitions` 줄 사이에 다음 툴 정의 문을 추가하세요

```python
# Begin: Tool Definitions

@tool
def mock_search_flights(origin: str, destination: str, departure: str) -> str:
    """Return mock flight options for a given origin/destination pair."""
    # create a local random.Random instance
    seed = hash((origin, destination, departure)) % (2**32)
    rng = random.Random(seed)
    airline = rng.choice(["SkyLine", "AeroJet", "CloudNine"])
    fare = rng.randint(700, 1250)

    return (
        f"Top choice: {airline} non-stop service {origin}->{destination}, "
        f"depart {departure} 09:15, arrive {departure} 17:05. "
        f"Premium economy fare ${fare} return."
    )


@tool
def mock_search_hotels(destination: str, check_in: str, check_out: str) -> str:
    """Return mock hotel recommendation for the stay."""
    seed = hash((destination, check_in, check_out)) % (2**32)
    rng = random.Random(seed)
    name = rng.choice(["Grand Meridian", "Hotel Lumière", "The Atlas"])
    rate = rng.randint(240, 410)

    return (
        f"{name} near the historic centre. Boutique suites, rooftop bar, "
        f"average nightly rate ${rate} including breakfast."
    )


@tool
def mock_search_activities(destination: str) -> str:
    """Return a short list of signature activities for the destination."""
    data = DESTINATIONS.get(destination.lower(), DESTINATIONS["paris"])
    bullets = "\n".join(f"- {item}" for item in data["highlights"])
    return f"Signature experiences in {destination.title()}:\n{bullets}"

# End: Tool Definitions
```

</br>

## AI 에이전트 모니터링을 위한 애플리케이션 구성

AI 에이전트 모니터링의 경우, LLM 대신 에이전트 이름이 포함된 메타데이터를 가진 에이전트를 생성한 다음 해당 에이전트를 호출해야 합니다.

> [!NOTE]
>
> 다음 단계에서는 애플리케이션에 에이전트를 추가해 보겠습니다 . 그런데 LangChain에서 에이전트란 ​​정확히 무엇일까요?
>
> LangChain 문서 에 따르면 :
>
> "에이전트는 언어 모델과 도구를 결합하여 작업에 대해 추론하고, 사용할 도구를 결정하고, 반복적으로 해결책을 찾아낼 수 있는 시스템을 만듭니다."
>
> 실제로 이는 모델이 더 이상 텍스트 생성에만 국한되지 않는다는 것을 의미합니다. 대신, API, 데이터베이스 또는 코드 실행과 같은 다양한 도구 중에서 선택하여 작업을 완료할 수 있습니다.
>
> 이러한 유형의 에이전트를 흔히 LangChain ReAct 에이전트 라고 부릅니다 .
>
> ReAct는 Reasoning + Acting 의 약자입니다 . 에이전트는 다음과 같은 루프를 통해 작동합니다.
>
> - 과제에 대한 간략한 이유,
> - 관련 도구를 선택하고 호출합니다.
> - 결과를 관찰하고,
> - 그 새로운 정보를 활용하여 다음 단계를 결정합니다.
>
> 이 과정은 상담원이 최종 답변을 내놓기에 충분한 정보를 수집할 때까지 반복됩니다.

그래서 우리는 `coordinator_node`, `flight_specialist_node`, `hotel_specialist_node`, `activity_specialist_node` 및 함수 의 정의를 `plan_synthesizer_node` 다음으로 대체하도록 하겠습니다

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
def coordinator_node(
    state: PlannerState
) -> PlannerState:
    llm = _create_llm("coordinator", temperature=0.2, session_id=state["session_id"])
    agent = _create_react_agent(llm, tools=[]).with_config(
        {
            "run_name": "coordinator",
            "tags": ["agent", "agent:coordinator"],
            "metadata": {
                "agent_name": "coordinator",
                "session_id": state["session_id"],
            },
        }
    )
    system_message = SystemMessage(
        content=(
            "You are the lead travel coordinator. Extract the key details from the "
            "traveller's request and describe the plan for the specialist agents."
        )
    )

    result = agent.invoke({"messages": [system_message] + list(state["messages"])})
    final_message = result["messages"][-1]
    state["messages"].append(
        final_message
        if isinstance(final_message, BaseMessage)
        else AIMessage(content=str(final_message))
    )
    state["current_agent"] = "flight_specialist"
    return state


def flight_specialist_node(
    state: PlannerState
) -> PlannerState:
    llm = _create_llm(
        "flight_specialist", temperature=0.4, session_id=state["session_id"]
    )
    agent = _create_react_agent(llm, tools=[mock_search_flights]).with_config(
        {
            "run_name": "flight_specialist",
            "tags": ["agent", "agent:flight_specialist"],
            "metadata": {
                "agent_name": "flight_specialist",
                "session_id": state["session_id"],
            },
        }
    )
    step = (
        f"Find an appealing flight from {state['origin']} to {state['destination']} "
        f"departing {state['departure']} for {state['travellers']} travellers."
    )

    # IMPORTANT: pass a proper list of messages (not stringified)
    messages = [
        SystemMessage(content="You are a flight booking specialist. Provide concise options."),
        HumanMessage(content=step),
    ]

    result = agent.invoke({"messages": messages})
    final_message = result["messages"][-1]
    state["flight_summary"] = final_message.content if isinstance(final_message, BaseMessage) else str(final_message)
    state["messages"].append(final_message if isinstance(final_message, BaseMessage) else AIMessage(content=str(final_message)))
    state["current_agent"] = "hotel_specialist"
    return state


def hotel_specialist_node(
    state: PlannerState
) -> PlannerState:
    llm = _create_llm(
        "hotel_specialist", temperature=0.5, session_id=state["session_id"]
    )
    agent = _create_react_agent(llm, tools=[mock_search_hotels]).with_config(
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


def activity_specialist_node(
    state: PlannerState
) -> PlannerState:
    llm = _create_llm(
        "activity_specialist", temperature=0.6, session_id=state["session_id"]
    )
    agent = _create_react_agent(llm, tools=[mock_search_activities]).with_config(
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

def plan_synthesizer_node(state: PlannerState) -> PlannerState:
    llm = _create_llm(
        "plan_synthesizer", temperature=0.3, session_id=state["session_id"]
    )

    agent = _create_react_agent(llm, tools=[]).with_config(
        {
            "run_name": "plan_synthesizer",
            "tags": ["agent", "agent:plan_synthesizer"],
            "metadata": {
                "agent_name": "plan_synthesizer",
                "session_id": state["session_id"],
            },
        }
    )

    system_content = (
        "You are the travel plan synthesiser. Combine the specialist insights into a "
        "concise, structured itinerary covering flights, accommodation and activities."
    )

    content = json.dumps(
        {
            "flight": state["flight_summary"],
            "hotel": state["hotel_summary"],
            "activities": state["activities_summary"],
        },
        indent=2,
    )

    out = agent.invoke(
        {
            "messages": [
                SystemMessage(content=system_content),
                HumanMessage(
                    content=(
                        f"Traveller request: {state['user_request']}\n\n"
                        f"Origin: {state['origin']} | Destination: {state['destination']}\n"
                        f"Dates: {state['departure']} to {state['return_date']}\n\n"
                        f"Specialist summaries:\n{content}"
                    )
                ),
            ]
        }
    )
    # 1) Extract the assistant’s final text
    final_msg = next(m for m in reversed(out["messages"]) if isinstance(m, AIMessage))
    state["final_itinerary"] = final_msg.content

    # 2) Append the new messages to your ongoing conversation
    state["messages"].extend(out["messages"])  # or append just final_msg

    state["current_agent"] = "completed"
    return state
```

항공편, 호텔, 액티비티 전문가 에이전트를 생성할 때 도구를 전달하는 방식을 살펴보세요. 에이전트가 호출되면 LLM은 요청을 처리하기 위해 해당 도구를 호출해야 하는지 여부를 결정합니다.

> [!TIP]
>
> 다음 명령어를 실행하여 변경 사항을 예상 결과와 비교하십시오.
>
> ```bash
> diff ~/workshop/agentic-ai/base-app/main.py ~/workshop/agentic-ai/app-with-agents-and-tools/main.py
> ```

</br>

## 업데이트 된 Docker 이미지 빌드

새로운 태그가 포함된 업데이트된 Docker 이미지를 빌드합니다.

```bash
cd ~/workshop/agentic-ai/base-app
docker build --platform linux/amd64 -t localhost:9999/agentic-ai-app:app-with-agents-and-tools .
docker push localhost:9999/agentic-ai-app:app-with-agents-and-tools
```

</br>

### 쿠버네티스 매니페스트 업데이트

편집 모드로 `~/workshop/agentic-ai/base-app/k8s.yaml` 파일을 열고 에이전트와 도구가 포함된 이미지를 사용하도록 이미지를 업데이트하세요.

```bash
          image: localhost:9999/agentic-ai-app:app-with-agents-and-tools
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

Splunk Observability Cloud에서 **[APM] > [AI Agents]** 으로 이동한 다음 본인 Environment가 필터 되어있는지 확인 합니다 (예: agentic-ai-shw-291e)

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/Agents-v2.png)

상단에 있는 `View related AI trace data` 버튼을 클릭하여 AI 관련 콘텐츠가 포함된 트레이스를 찾아 볼 수 있습니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/AI-trace-data.png)

최신 트레이스 중 하나를 선택하십시오. 이제 에이전트 흐름에 모든 에이전트가 표시됩니다!

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/Trace-v2.png)

툴 호출 내역도 확인 할 수 있습니다.

![](https://splunk.github.io/observability-workshop/en/ninja-workshops/ai/18-agentic-ai/images/TraceWithToolCalls.png)

</br>

---

**Module 7. Add Tool Calls DONE!**
