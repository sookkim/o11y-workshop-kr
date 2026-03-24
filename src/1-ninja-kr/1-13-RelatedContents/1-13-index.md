# Related Contents 로 데이터 통합분석 하기

**Splunk Cloud/Enterprise 와 O11y Cloud의 Integration**

Splunk Observabiltiy Cloud 와 Splunk Cloud는 두개의 URL로 각각 존재합니다.
장애 분석시 많은 불편함이 있고, 스플렁크는 이 두개의 플랫폼을 통합하는 과정에 있습니다.

통합의 중심은 Splunk Enterprise 이며, Splunk 로그 플랫폼에서 Splunk O11y 데이터를 분석 할 수 있습니다.

## 1. Set Up related content for Infra monitoring

Splunk Enterprise UI에서, **[Apps] > [Discover Splunk Observability Cloud]**

- Realm: us1
- Access Token: Splunk Observability Cloud의 **[Settings] > [Acces Tokens]** 에서 확인 가능하지만, 이번 워크샵에서는 미리 생성된 토큰을 사용합니다

    <img src="../../images/1-ninja-kr/1-13-related_content_setup.png" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

- 자동 UI 업데이트: enable
- Field aliasing: enable

**Related Contents가 적용되는데는 약 1~2분 정도 소요됩니다**

- 다시 로그를 검색하여 로그라인을 확장했을 때 Related Content 라는 칼럼이 생겼는지 확인합니다.

    <img src="../../images/1-ninja-kr/1-13-relatedcontent.jpg" width="1000" style="border: 1px solid #000; display: block; margin-left: 0;">

- Preview 를 눌러보면 관련 Host 의 메트릭이 표현됩니다
  <img src="../../images/1-ninja-kr/1-13-relatedcontent2.jpg" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

## 2. Related Content for APM

연결 된 데이터를 보면 로그가 가지고 있는 정보가 hostname 밖에 없기 때문에 해당 정보로 맵핑을 한다는 것을 알 수 있습니다. 시스템 관리자는 인프라 뿐 아니라 APM 과도 연계분석이 필요할 수 있으므로, APM도 함께 연결 될 수 있도록 설정을 진행 해 보겠습니다.

logback 에서 남기고 있는 로그 패턴에 Trace ID 를 주입하여 로그를 남기도록 합니다.

- 리눅스 환경에서 로그 설정 경로로 이동하여 설정파일을 엽니다

  ```bash
  cd ~/spring-petclinic/src/main/resources

  vi logback-spring.xml
  ```

- 아래와 같이 패턴을 수정 후 저장합니다

  ```xml
  <encoder>
    <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg trace_id=%X{trace_id} span_id=%X{span_id} service.name=%X{service.name}, deployment.environment=%X{deployment.environment} trace_flags=%X{trace_flags} %n</pattern>
  </encoder>
  ```

- 프로젝트 루트로 이동하여 펫클리닉을 다시 빌드합니다

  ```bash
  cd ~/spring-petclinic

  ./mvnw package -Dmaven.test.skip=true
  ```

4. 애플리케이션을 재기동 합니다

   ```bash
   java -javaagent:./splunk-otel-javaagent.jar \
   -Dserver.port=8083 \
   -Dsplunk.profiler.enabled=true \
   -Dsplunk.profiler.memory.enabled=true \
   -jar target/spring-petclinic-*.jar --spring.profiles.active=mysql
   ```

5. 일부러 에러로그를 발생시킨 후에 로그를 다시 검색합니다. Trace_id에 연결 부분이 생겼나요?
   <img src="../../images/1-ninja-kr/1-13-relatedcontent3.jpg" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">
   Open in APM 버튼을 눌러 어떤 데이터로 넘어가는지 확인 해 봅시다

</br>

---

**Module 1-13. Related Contents 로 데이터 통합분석 하기 DONE!**

<!--
    K8S 환경일 경우 아래 내용을 참조하세요

## 13-2. Splunk Platform 에서 로그 검색

Search & Report 앱에서 쿼리 수행

Splunk Observability Cloud의 데이터와 매칭될 만한 쿼리를 수행

```
index=main k8s.cluster.name=*
```

![](../../images/1-ninja-kr/1-13-related_content_search.png)

![](../../images/1-ninja-kr/1-13-related_content_search2.png)

-->
