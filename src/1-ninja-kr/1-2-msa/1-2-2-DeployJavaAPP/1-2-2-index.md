# Deploy a Java Application

</br>

<img src="../../../images/1-ninja-kr/1-2-apm.jpg" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

<img src="../../../images/1-ninja-kr/1-2-trace.jpg" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

</br>

## Build sample application in your host

APM을 설정하기 위해 가장 먼저 필요한 것은 애플리케이션입니다. 이번 실습에서는 Spring PetClinic 애플리케이션을 사용하겠습니다. 이 애플리케이션은 Spring 프레임워크(Springboot)로 구축된 매우 간단한 Java 샘플 애플리케이션입니다.

1. 아래 명령어를 이용하여 샘플 앱을 구동합니다

   ```bash
   kubectl apply -f ~/workshop/petclinic/deployment.yaml
   ```

2. Pet Clinic Pod가 실행 중인지 확인하여 배포를 검증할 수 있습니다. 컨테이너를 다운로드하고 시작하는 데 몇 분 정도 소요될 수 있습니다.

   ```bash
   kubectl get pods
    NAME                                                         READY   STATUS    RESTARTS   AGE
    admin-server-54b4d6f54-g2kgp                                 1/1     Running   0          110s
    api-gateway-88bf97bd5-nmz9b                                  1/1     Running   0          111s
    config-server-5cc585ff59-gcf82                               1/1     Running   0          111s
    customers-service-5b86559cdb-nrdlw                           1/1     Running   0          111s
    discovery-server-796f6c4dc-j7dps                             1/1     Running   0          111s
    petclinic-db-dfb77856f-rtmtq                                 1/1     Running   0          110s
    petclinic-loadgen-deployment-7c8f6bd8f5-26xdk                1/1     Running   0          110s
    splunk-otel-collector-agent-bttrb                            1/1     Running   0          20m
    splunk-otel-collector-agent-czp9x                            1/1     Running   0          20m
    splunk-otel-collector-agent-wnbs5                            1/1     Running   0          20m
    splunk-otel-collector-k8s-cluster-receiver-c4f66966d-j8hm8   1/1     Running   0          20m
    splunk-otel-collector-operator-794c5fc9f7-vzq9f              2/2     Running   0          20m
    vets-service-575d957d5c-mjk9k                                1/1     Running   0          111s
    visits-service-544d99d8c8-b2jb4                              1/1     Running   0          111s
   ```

   출력 결과가 위의 출력 탭에 표시된 결과와 일치하는지 확인하십시오 kubectl get pods. 모든 서비스가 실행 중으로 표시되는지 확인하세요.

3. 애플리케이션을 테스트하려면 인스턴스의 공용 IP 주소를 확인해야 합니다. 다음 명령어를 실행하여 확인할 수 있습니다.

   ```bash
   curl http://ifconfig.me
   ```

   위에서 확인 한 주소로 인터넷 브라우저에서 http://<ip_address>:81 을 입력하여 애플리케이션이 실행중인지 확인합니다. PetClinic 애플리케이션이 실행 중인 것을 확인할 수 있습니다.

    <img src="https://splunk.github.io/observability-workshop/en/ninja-workshops/1-automatic-discovery/2-petclinic-kubernetes/images/petclinic.png" width="1200" style="border: 1px solid #000; display: block; margin-left: 0;">

   Owners, Veterinatians 탭을 클릭하여 애플리케이션이 제대로 동작하는지 확인합니다

</br>

---

**Module 2. Deploy a Java Application DONE!**
