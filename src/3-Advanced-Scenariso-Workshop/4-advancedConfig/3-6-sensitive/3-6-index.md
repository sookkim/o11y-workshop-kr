# 6. Redacting Sensitive Data

이 실습에서는 특정 태그를 제거하고 텔레메트리 범위에서 민감한 데이터를 삭제하도록 OpenTelemetry 수집기를 구성하는 방법에 대해 설명합니다. 이는 신용카드 번호, 개인 데이터 또는 처리 또는 내보내기 전에 익명화해야 하는 기타 보안 관련 세부정보와 같은 민감한 정보를 보호하는 데 매우 중요합니다.

다음을 포함하여 OpenTelemetry 수집기에서 주요 프로세서를 구성하는 방법을 안내해 드리겠습니다:

- **Attrbutes Processor :** 특정 스팬 속성을 수정하거나 제거합니다.
- **Redaction Processor :** 민감한 데이터가 저장 또는 전송되기 전에 삭제되도록 합니다.
  <br>

## 실습 준비하기

- `WORKSHOP` 디렉토리에서 `6-sensitive-data` 라는 이름의 서브도메인을 생성합니다
- 그런다음, `5-dropping-span` 디렉토리에서 `6-sensitive-data` 디렉토리로 `*.yaml` 파일을 모두 복제합니다

> ⚠️ **Warning** <br>
> 이 시점부터 본 실습은 모든 터미널 창에서 **_~/WORKSHOP/6-sensitive-data_** 디렉터리 경로에서 실행됩니다.

이 모듈의 작업 디렉토리가 아래와 같은 파일로 구성되어있어야 합니다

```bash
.
├── agent.yaml
└── gateway.yaml
```

<br>

## 민감정보 처리 설정 하기

이 단계에서는 속성 및 redaction 프로세서를 포함하도록 `agent.yaml`을 수정합니다. 이러한 프로세서는 스팬 속성 내의 민감한 데이터가 기록되거나 내보내기 전에 적절하게 처리되도록 하는 데 도움이 됩니다.

아래처럼 콘솔에 표시되는 일부 스팬 속성에 개인 및 민감한 데이터가 포함되어 있는 것이 있으며, 이제 이러한 정보를 효과적으로 필터링하고 삭제하는 데 필요한 프로세서를 구성할 것입니다.

```bash
<snip>
Attributes:
     -> user.name: Str(George Lucas)
     -> user.phone_number: Str(+1555-867-5309)
     -> user.email: Str(george@deathstar.email)
     -> user.account_password: Str(LOTR>StarWars1-2-3)
     -> user.visa: Str(4111 1111 1111 1111)
     -> user.amex: Str(3782 822463 10005)
     -> user.mastercard: Str(5555 5555 5555 4444)
  {"kind": "exporter", "data_type": "traces", "name": "debug"}
```

1. 에이전트 터미널 창에서 `agent.yaml` 파일을 열고 아래와 같은 설정을 추가합니다

   - **`attributes` 프로세서를 추가합니다 :** attributes 프로세서를 사용하면 스팬 속성(태그)의 값을 업데이트, 삭제 또는 해시 처리하여 수정할 수 있습니다. 이 기능은 민감한 정보를 내보내기 전에 난독화할 때 특히 유용합니다.

   ```yaml
   attributes/update:
     actions: # Actions
       - key: user.phone_number # Target key
         action: update # Update action
         value: 'UNKNOWN NUMBER' # New value
       - key: user.email # Target key
         action: hash # Hash the email value
       - key: user.password # Target key
         action: delete # Delete the password
   ```

- `user.phone_number` 속성을 정적 값(“UNKNOWN NUMBER”)으로 업데이트합니다.
- `user.email` 속성을 해시 처리하여 원본 이메일이 노출되지 않도록 합니다.
- `user.password` 속성을 삭제하여 스팬에서 완전히 제거합니다.

<br>

2. **`redaction` 프로세서를 추가합니다 :** redaction 프로세서는 신용카드 번호 또는 기타 개인 식별 정보(PII)와 같이 미리 정의된 패턴을 기반으로 스팬 속성에서 민감한 데이터를 감지하고 제거합니다.

   ```yaml
   redaction/redact:
     allow_all_keys: true # If false, only allowed keys will be retained
     blocked_values: # List of regex patterns to block
       - '\b4[0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b' # Visa
       - '\b5[1-5][0-9]{2}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b' # MasterCard
     summary: debug # Show debug details about redaction
   ```

   - 모든 속성이 처리되도록 `allow_all_keys: true`로 설정합니다(false로 설정하면 명시적으로 허용된 키만 유지됨).
   - 정규식으로 blocked_values를 정의하여 **비자 및 마스터카드 신용카드 번호**를 감지하고 삭제합니다.
   - `summary: debug` 옵션은 디버깅을 위해 삭제 프로세스에 대한 자세한 정보를 기록합니다.
     <br>

3. `traces` 파이프라인을 수정합니다 : 두 프로세서를 trace 파이프라인에 통합합니다. 처음에는 redaction 프로세서를 주석 처리해야 합니다(나중에 별도의 연습에서 활성화할 예정입니다)
   ```yaml
   traces:
     receivers:
       - otlp
     processors:
       - memory_limiter
       - attributes/update # Update, hash, and remove attributes
       #- redaction/redact              # Redact sensitive fields using regex
       - resourcedetection
       - resource/add_mode
       - batch
     exporters:
       - debug
       - file
       - otlphttp
   ```
   <br>

otelbin.io를 사용하여 에이전트 구성의 유효성을 검사합니다

![](../../images/3-advancedConfig/3-6-sensitive.jpg)

<br>

## Attributes 프로세서 테스트하기

이 실습에서는 에이전트가 스팬 데이터를 내보내기 전에 `user.account_password`를 삭제하고, `user.phone_number` 속성을 업데이트하고, `user.email`을 해싱해 보겠습니다.

1. **Gateway 를 실행합니다**

   ```bash
   ../otelcol --config=gateway.yaml
   ```

2. **Agent 를 실행합니다**

   ```bash
   ../otelcol --config=agent.yaml
   ```

3. **스팬 터미널에서 loadgen 으로 Span을 발생시킵니다**

   ```bash
   ../loadgen -count 1
   ```

4. Agent 와 Gateway의 디버그 아웃풋에서 `user.account_password`가 삭제 되었는지, `user.phone_number` 속성이 정적 텍스트로 변경되었는지, `user.email`이 해시처리 되었는지 확인합니다

   ```bash
   -> user.name: Str(George Lucas)
   -> user.phone_number: Str(UNKNOWN NUMBER)
   -> user.email: Str(62d5e03d8fd5808e77aee5ebbd90cf7627a470ae0be9ffd10e8025a4ad0e1287)
   -> payment.amount: Double(51.71)
   -> user.visa: Str(4111 1111 1111 1111)
   -> user.amex: Str(3782 822463 10005)
   -> user.mastercard: Str(5555 5555 5555 4444)
   ```

5. 아래 `jq` 명령어로 위에서 확인했던 내용을 다시 확인 해 봅시다

   ```bash
   # 아래 jq 명령어 실행
   jq '.resourceSpans[].scopeSpans[].spans[].attributes[] | select(.key == "user.password" or .key == "user.phone_number" or .key == "user.email") | {key: .key, value: .value.stringValue}' ./gateway-traces.out
   ```

   아래와 같은 출력이 보이면 됩니다

   ```json
   {
   "key": "user.phone_number",
   "value": "UNKNOWN NUMBER"
   }
   {
   "key": "user.email",
   "value": "62d5e03d8fd5808e77aee5ebbd90cf7627a470ae0be9ffd10e8025a4ad0e1287"
   }
   ```

   <br>

> ⚡ **Important** <br>
> 확인이 끝났으면 Agent/Gateway 터미널에서 `Ctrl+C` 를 눌러 에이전트를 중지합니다

<br>

## Redaction 프로세서 설정 테스트하기

redaction 프로세서는 텔레메트리 데이터에서 허용되거나 제거되는 속성과 값을 정밀하게 제어할 수 있습니다.

이 실습에서는 에이전트가 스팬 데이터를 내보내기 전에 스팬 데이터의 `user.visa` 및 `user.mastercard` 값을 삭제해 보겠습니다.
<br>

1. **출력파일 삭제 :** \*.out 파일을 모두 삭제합니다
2. **Gateway 를 실행합니다**

   ```bash
   ../otelcol --config=gateway.yaml
   ```

3. **에이전트 터미널**에서 `agent.yaml `파일을 열어 `redaction/redact` 프로세서를 활성화 해 줍니다. 이전 실습에서 주석처리 했었던 항목입니다

   ```yaml
   traces:
     receivers:
       - otlp
     processors:
       - memory_limiter
       - attributes/update # Update, hash, and remove attributes
       - redaction/redact # Redact sensitive fields using regex
       - resourcedetection
       - resource/add_mode
       - batch
     exporters:
       - debug
       - file
       - otlphttp
   ```

4. **Agent 를 실행합니다**

   ```bash
   ../otelcol --config=agent.yaml
   ```

5. **스팬 터미널에서 loadgen 으로 Span을 발생시킵니다**

   ```bash
   ../loadgen -count 1
   ```

6. 에이전트와 게이트웨이 모두 `user.visa` 및 `user.mastercard`의 값이 업데이트되었는지 확인하세요. 일치하는 정규식 패턴이 `blocked_values`에 추가되지 않았으므로 `user.amex` 속성 값은 수정되지 않은 것을 알 수 있습니다
   ```bash
   -> user.name: Str(George Lucas)
   -> user.phone_number: Str(UNKNOWN NUMBER)
   -> user.email: Str(62d5e03d8fd5808e77aee5ebbd90cf7627a470ae0be9ffd10e8025a4ad0e1287)
   -> payment.amount: Double(69.71)
   -> user.visa: Str(****)
   -> user.amex: Str(3782 822463 10005)
   -> user.mastercard: Str(****)
   -> redaction.masked.keys: Str(user.mastercard,user.visa)
   -> redaction.masked.count: Int(2)
   ```

> 📝 **Note** <br>
> redaction 프로세서에 `summary:debug`를 포함하면 디버그 출력에 마스킹된 값의 수와 함께 어떤 일치하는 키 값이 삭제되었는지에 대한 요약 정보가 포함됩니다.<br>
> 아래 예시 참조<br>
>
> ```bash
> -> redaction.masked.keys: Str(user.mastercard,user.visa)
> -> redaction.masked.count: Int(2)
> ```
>
> <br>

<br>

7. `jq`를 사용하여 `gateway-traces.out`에서 `user.visa` 및 `user.mastercard`가 업데이트되었는지 확인합니다.

   ```bash
   jq '.resourceSpans[].scopeSpans[].spans[].attributes[] | select(.key == "user.visa" or .key == "user.mastercard" or .key == "user.amex") | {key: .key, value: .value.stringValue}' ./gateway-traces.out
   ```

   아래와 같은 출력이 보이면 성공입니다

   ```json
   {
   "key": "user.visa",
   "value": "****"
   }
   {
   "key": "user.amex",
   "value": "3782 822463 10005"
   }
   {
   "key": "user.mastercard",
   "value": "****"
   }
   ```

   <br>

> ⚡ **Important** <br>
> 확인이 끝났으면 Agent/Gateway 터미널에서 `Ctrl+C` 를 눌러 에이전트를 중지합니다
