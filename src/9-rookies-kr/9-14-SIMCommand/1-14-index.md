# 14. SIM Command (Splunk Infrastructure Monitoring Add-on)

**Splunk O11y Cloud의 메트릭 데이터를 Splunk Cloud에서 SPL로 검색**

Splunk Observabiltiy Cloud 에 있는 metric 데이터를 Splunk Cloud 에서 SPL로 검색 할 수 있습니다.

## 14-1. Set Up

Splunk Cloud UI에서, 앱 > Splunk Infrastructure Monitoring Add-on
만약 없을 경우 해당 앱을 설치합니다.


![](../../images/1-ninja-kr/1-14-Infrastructure-Monitoring-Add-on.png)

설치 후, 앱으로 이동합니다.

Splunk Infrastructure Monitoring Add-on > 설정 > Connect an Account


![](../../images/1-ninja-kr/1-14-Infrastructure-Monitoring-Add-on-connect.png)

아래와 같이 realm, Access Token을 입력합니다.
그리고 Check Connection 을 선택해서 정상적으로 연결되는지 확인합니다.

![](../../images/1-ninja-kr/1-14-Infrastructure-Monitoring-Add-on-connect2.png)

제출버튼 클릭

## 14-2. Splunk Platform 에서 메트릭 검색
Search & Report 앱에서 쿼리 수행
signalflow 쿼리를 검색하는 것임.

![](../../images/1-ninja-kr/1-14-signalflow.png)

![](../../images/1-ninja-kr/1-14-signalflow2.png)

Search & Report에서 다음 쿼리 수행.
| sim flow query=""에서 query 문장에는 signalFlow 전체 내용을 복사

```
| sim flow query="A = data('container_cpu_utilization').mean(over='1m').count(by=['k8s.cluster.name']).publish(label='A')
B = data('container.cpu.time').mean(over='1m').count(by=['k8s.cluster.name']).publish(label='B')" with_derived_metadata=true
```
![](../../images/1-ninja-kr/1-14-simcommand.png)

이후 다양한 SPL command 사용이 가능하여 별도 대시보드 제작 가능

## 14-3. 고급 과정
설정 > 데이터 입력 > Splunk Infrastructure Monitoring Data Streams

자주 사용하는 메트릭에 대해서 활성화를 시키거나, 추가로 signalFlow 형태로 만들면 됩니다.

sim_metrics 인덱스에 metric과 dimension 값을 추출 할 수 있습니다.

```
| mcatalog values(_dims) WHERE index="sim_metrics" AND sourcetype="*" BY index metric_name
```



## 관련 Documents
https://help.splunk.com/en/splunk-it-service-intelligence/extend-itsi-and-ite-work/splunk-infrastructure-monitoring-add-on/1.2/install-and-configure/configure-inputs-in-splunk-infrastructure-monitoring-add-on

https://docs.splunk.com/Documentation/SIMAddon/latest/Install/Commands