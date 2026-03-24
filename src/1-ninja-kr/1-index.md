# Splunk Ninja Workshop for Korea

오늘 진행될 Splunk Observability Cloud Ninja Workshop🥷의 콘텐츠는 아래와 같습니다

원활한 워크샵이 되도록 시간과 아젠다를 참고 부탁드립니다

## Pre-Requisite

본 워크샵은 아래 Splunk Show 를 통해 실습환경을 미리 구성 후 진행하셔야 합니다

- Splunk4Ninjas - Observability

</br>

<div style="display:grid; grid-template-columns:repeat(2, minmax(220px, 1fr)); gap:20px;">
            <a href="src/1-ninja-kr/1-1-monolith/1-1-index.html" class="card">
              <img src="https://splunk.github.io/observability-workshop/en/ninja-workshops/1-automatic-discovery/1-petclinic-monolith/images/petclinic-exercise.png" style="width:600px; height:340px;">
              <div class="card-body">
                <h3>Monolith Workshop</h3>
                <p>VM 환경에 Java Springboot 샘플 애플리케이션을 구동하여 Splunk o11y Cloud 의 인프라, APM, Log 를 수집하는 워크샵입니다</p>
              </div>
            </a>
            <a href="src/1-ninja-kr/1-2-msa/1-2-index.html" class="card">
              <img src="https://splunk.github.io/observability-workshop/en/ninja-workshops/1-automatic-discovery/2-petclinic-kubernetes/images/auto-instrumentation-java-diagram.png" style="width:600px; height:340px;">
              <div class="card-body">
                <h3>Microservice (K8S) Workshop</h3>
                <p>Kubernetes 환경에 구현 된 애플리케이션을 대상으로 Deamonset 형태의 에이전트를 Helm을 통해 배포하고 Zero-code Instrument 를 통해 인프라, APM, Log 수집을 해 보는 워크샵입니다. </p>
              </div>
            </a>
          </div>
          <style>
            .card {
              display: block;
              text-decoration: none;
              color: inherit;
              border: 1.5px solid #d1d5db;
              border-radius: 18px;
              overflow: hidden;
              background: #fff;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
              transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
            }
            .card:hover {
              border-color: #ff1493;
              transform: translateY(-8px);
              box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14);
            }
            .card img {
              width: 100%;
              display: block;
              height: auto;
            }
            .card-body {
              padding: 16px;
            }
            .card-body h3 {
              margin: 0 0 8px;
              font-size: 18px;
            }
            .card-body p {
              margin: 0;
              color: #555;
              line-height: 1.5;
              font-size: 14px;
            }
          </style>
