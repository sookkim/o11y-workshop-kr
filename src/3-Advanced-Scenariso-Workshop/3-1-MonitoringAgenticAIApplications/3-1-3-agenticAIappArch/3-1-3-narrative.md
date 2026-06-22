# 이 모듈의 전체 발표 내용

## Intro

이번 섹션에서는 Agentic AI Application Architecture를 살펴보겠습니다.
이 워크숍의 최종 목표는 OpenTelemetry를 사용해서 AI 애플리케이션을 계측하고 관찰 가능하게 만드는 것입니다.
그런데 trace나 telemetry를 제대로 이해하려면 먼저 애플리케이션이 어떤 구조로 동작하는지 알아야 합니다. 그래서 이 섹션에서는 여행 계획 애플리케이션의 내부 아키텍처를 살펴봅니다.

**Before we start**

먼저 LangChain과 LangGraph의 역할을 구분하겠습니다. LangChain은 프롬프트, 메시지, 모델 호출, 도구 통합 같은 LLM 기반 작업의 구성 요소를 제공합니다.
반면 LangGraph는 이런 구성 요소들을 상태 기반 워크플로로 연결하고, 어떤 단계가 어떤 순서로 실행될지 제어합니다.
이 애플리케이션은 LangGraph로 전체 워크플로를 오케스트레이션하고, 각 노드 내부에서는 LangChain의 메시지와 ChatOpenAI 모델 호출을 사용합니다.

**Workflow**
전체 흐름은 Flask API에서 시작됩니다.
사용자가 /travel/plan 엔드포인트로 여행 계획 요청을 보내면 Flask가 요청 JSON에서 출발지, 목적지, 사용자 요청, 여행자 수를 읽습니다.
그런 다음 plan_travel_internal() 함수를 호출합니다. 이 함수가 실제 워크플로 실행의 시작점입니다.
**Flask API → plan_travel_internal() → LangGraph workflow → LangChain 기반 LLM 노드들 → 최종 JSON 응답** 의 흐름

</br>

## Request Lifecycle

plan_travel_internal()에서는 먼저 세션 ID를 만들고, 여행 날짜를 계산하고, PlannerState라는 초기 상태를 구성합니다.
이 상태에는 사용자의 요청, 출발지, 목적지, 여행자 수, 메시지 목록, 그리고 flight summary, hotel summary, activities summary, final itinerary 같은 필드가 들어갑니다.
처음에는 summary 값들이 비어 있고, current_agent는 start로 설정됩니다.

</br>

## Shared State

이 애플리케이션에서 가장 중요한 개념은 공유 상태입니다. LangGraph에서는 이 상태가 그래프 전체를 따라 이동합니다.
각 노드는 상태를 입력받고, 필요한 값을 읽고, 자기 역할에 맞는 작업을 수행한 뒤, 결과를 다시 상태에 기록합니다. 예를 들어 flight specialist는 출발지, 목적지, 날짜, 여행자 수를 읽고 항공편 요약을 만든 다음 flight_summary에 저장합니다.
그리고 다음 노드로 이동하기 위해 current_agent를 hotel_specialist로 변경합니다.

**즉, 노드들이 서로 직접 대화한다기보다는 하나의 공통 작업 파일을 계속 업데이트하면서 협업한다고 이해하면 쉽습니다.**

</br>

## LangGraph 정의

그래프 구조는 build_workflow()에서 정의됩니다. 여기서 StateGraph를 만들고 coordinator, flight specialist, hotel specialist, activity specialist, plan synthesizer 노드를 추가합니다.
각 노드가 실행된 뒤에는 should_continue() 함수가 호출되어 다음 노드를 결정합니다. 이 함수는 상태 안의 current_agent 값을 보고 다음에 어떤 노드로 갈지 선택합니다.

각 노드는 사실상 Python 함수입니다. 상태를 입력받고, LLM을 생성하거나 접근하고, 상태값을 기반으로 프롬프트를 만들고, LangChain의 SystemMessage와 HumanMessage를 구성한 다음 모델을 호출합니다. 모델 응답은 상태의 summary 필드와 messages 리스트에 저장됩니다. 마지막으로 다음 실행할 agent를 **current_agent**에 기록하고 업데이트된 상태를 반환합니다.

LangChain 메시지 추상화도 중요한 부분입니다. 이 앱은 하나의 긴 프롬프트 문자열을 사용하는 대신 SystemMessage, HumanMessage, AIMessage 같은 메시지 구조를 사용합니다. SystemMessage에는 AI의 역할을 정의하고, HumanMessage에는 실제 작업 내용을 넣습니다. 그래서 같은 모델을 사용하더라도 flight specialist는 항공 전문가처럼, hotel specialist는 호텔 전문가처럼 동작하게 만들 수 있습니다.

</br>

## LLM 생성 로직

LLM 생성은 create_llm() 함수로 분리되어 있습니다. 이 함수는 ChatOpenAI 인스턴스를 만들고, 모델 이름은 환경 변수에서 가져옵니다. 또한 각 노드는 자신의 역할에 맞는 temperature를 사용할 수 있습니다. 예를 들어 synthesizer는 최종 응답을 안정적으로 정리해야 하므로 낮은 temperature를 사용할 수 있고, 활동 추천 노드는 조금 더 창의적인 설정을 사용할 수 있습니다.

</br>

## Synthesizer 분해 패턴

마지막 단계는 plan synthesizer입니다. 이 노드는 앞에서 생성된 flight_summary, hotel_summary, activities_summary를 모두 읽고, 사용자의 원래 요청과 여행 날짜, 출발지, 목적지를 함께 고려해서 최종 itinerary를 만듭니다. 이 패턴을 decomposition pattern이라고 볼 수 있습니다. 큰 문제를 전문가별 작은 문제로 나누고, 중간 결과를 수집한 뒤, 마지막에 하나의 답으로 종합하는 방식입니다.

</br>

## 이 구조를 알아야 하는 이유

이 구조를 이해하는 이유는 이후 Observability와 직접 연결되기 때문입니다. Agentic AI 애플리케이션에서는 최종 응답만 봐서는 충분하지 않습니다. 어떤 노드가 실행됐는지, 어떤 순서로 실행됐는지, 각 노드가 얼마나 걸렸는지, 어떤 입력과 출력이 오갔는지, 상태가 어떻게 바뀌었는지를 볼 수 있어야 합니다. 그래야 응답이 느릴 때 어느 노드가 병목인지 찾을 수 있고, 최종 결과가 이상할 때 어느 중간 단계에서 문제가 생겼는지 추적할 수 있습니다.

예를 들어 전체 응답이 느리다면 단순히 앱이 느리다고 볼 것이 아니라 coordinator, flight specialist, hotel specialist, activity specialist, synthesizer 중 어느 단계가 오래 걸렸는지 확인해야 합니다. 또 사용자의 호텔 선호 조건이 최종 일정에 반영되지 않았다면, 그 조건이 초기 요청에 있었는지, shared state에 저장되었는지, hotel summary에 반영되었는지, 마지막 synthesizer가 누락한 것인지를 단계별로 확인해야 합니다.

</br>

## 마지막에 강조할 핵심 요약

마무리할 때는 세 가지로 정리하면 좋습니다.

1. LangChain과 LangGraph는 역할이 다릅니다. LangChain은 LLM 호출과 메시지 구성을 담당하고, LangGraph는 상태 기반 워크플로 실행을 담당합니다.
2. 이 앱의 중심은 Shared State입니다. 모든 노드는 PlannerState를 읽고 업데이트하며, current_agent를 통해 다음 흐름을 제어합니다.
3. Observability는 이 구조를 이해해야 의미가 있습니다. 각 노드의 실행 시간, 입력, 출력, 상태 변화, LLM 호출 정보를 추적해야 병목과 품질 문제를 분석할 수 있습니다.
