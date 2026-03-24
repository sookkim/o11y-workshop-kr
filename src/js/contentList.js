// TODO: add MENU HERE
var CONTENTS = [
  {
    id: '0',
    title: 'Splunk Observability Workshops',
    menuName: 'Splunk Observability Workshops',
    href: '/o11y-workshop-kr/index.html',
    prev: '',
    next: '1',
    sub: [
      // Ch1 - Splunk Ninja Workshop for KoreaSplunk Ninja Workshop for Korea
      {
        id: '1', // required. page ID
        title: 'Splunk Ninja Workshop for Observability', // required. Bread crumbs text
        menuName: 'Splunk Ninja Workshop for Observability', // required. Side bar text
        href: '/o11y-workshop-kr/src/1-ninja-kr/1-index.html', // required. HTML file path
        prev: '0',
        next: '1-0',
        sub: [
          {
            id: '1-1', // required. page ID
            title: '1-1. Monolith Workshop', // required. Bread crumbs text
            menuName: '1-1. Monolith Workshop', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-1-monolith/1-1-index.html', // required. HTML file path
            prev: '1',
            next: '1-1',
            sub: [],
          },
          {
            id: '1-2', // required. page ID
            title: '1. Deploy the OpenTelemetry Collector', // required. Bread crumbs text
            menuName: '1. Deploy the OpenTelemetry Collector', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-1-DeployOpenTelemetryCollector/1-1-index.html', // required. HTML file path
            prev: '1-0',
            next: '1-2',
            sub: [],
          },
          {
            id: '1-2', // required. page ID
            title: '2. Deploy the Java Application', // required. Bread crumbs text
            menuName: '2. Deploy the Java Application', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-2-DeployJavaAPP/1-2-index.html', // required. HTML file path
            prev: '1-1',
            next: '1-3',
            sub: [],
          },
          {
            id: '1-3', // required. page ID
            title: '3. Instrument a Java Application with OpenTelemetry', // required. Bread crumbs text
            menuName: '3. Instrument a Java Application with OpenTelemetry', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-3-InstrumentJavaAPPwithOpenTelemetry/1-3-index.html', // required. HTML file path
            prev: '1-2',
            next: '1-4',
            sub: [],
          },
          {
            id: '1-4', // required. page ID
            title: '4. Dockerize the Application', // required. Bread crumbs text
            menuName: '4. Dockerize the Application', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-4-DockerizeApp/1-4-index.html', // required. HTML file path
            prev: '1-3',
            next: '1-5',
            sub: [],
          },
          {
            id: '1-5', // required. page ID
            title: '5. Add Instrumentation to Dockerfile', // required. Bread crumbs text
            menuName: '5. Add Instrumentation to Dockerfile', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-5-AddInstrumentDocker/1-5-index.html', // required. HTML file path
            prev: '1-4',
            next: '1-6',
            sub: [],
          },
          {
            id: '1-6', // required. page ID
            title: '6. Install Opentelemetry in K8s', // required. Bread crumbs text
            menuName: '6. Install Opentelemetry in K8s', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-6-InstallOtelinK8s/1-6-index.html', // required. HTML file path
            prev: '1-5',
            next: '1-7',
            sub: [],
          },
          {
            id: '1-7', // required. page ID
            title: '7. Deploy app to K8s', // required. Bread crumbs text
            menuName: '7. Deploy app to K8s', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-7-DeployAPPtoK8s/1-7-index.html', // required. HTML file path
            prev: '1-6',
            next: '1-8',
            sub: [],
          },
          {
            id: '1-8', // required. page ID
            title: '8. Zero-Code Instrumentation for K8S Application', // required. Bread crumbs text
            menuName: '8. Zero-Code Instrumentation for K8S Application', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-8-ZeroCodeInstrumentation/1-8-index.html', // required. HTML file path
            prev: '1-7',
            next: '1-9',
            sub: [],
          },
          {
            id: '1-9', // required. page ID
            title: '9. Log collection to Splunk Cloud', // required. Bread crumbs text
            menuName: '9. Log collection to Splunk Cloud', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-9-CollectLogs/1-9-index.html', // required. HTML file path
            prev: '1-8',
            next: '1-10',
            sub: [],
          },
          {
            id: '1-10', // required. page ID
            title: '10. Set Log Observer connector', // required. Bread crumbs text
            menuName: '10. Set Log Observer connector', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-10-LogObserverConnector/1-10-index.html', // required. HTML file path
            prev: '1-9',
            next: '1-11',
            sub: [],
          },
          {
            id: '1-11', // required. page ID
            title: '11. Challenge : Add Receier for advanced metrics', // required. Bread crumbs text
            menuName: '11. Challenge : Add Receier for advanced metrics', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-11-ChallengeReceiver/1-11-index.html', // required. HTML file path
            prev: '1-10',
            next: '1-12',
            sub: [],
          },
          {
            id: '1-12', // required. page ID
            title: '12. Collect Metrics, Traces, Logs to Splunk Platform', // required. Bread crumbs text
            menuName: '12. Collect Metrics, Traces, Logs to Splunk Platform', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-12-CollectMetricsToSplunk/1-12-index.html', // required. HTML file path
            prev: '1-11',
            next: '1-13',
            sub: [],
          },
          {
            id: '1-13', // required. page ID
            title: '13. Related Contents', // required. Bread crumbs text
            menuName: '13. Related Contents', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-13-RelatedContents/1-13-index.html', // required. HTML file path
            prev: '1-12',
            next: '1-14',
            sub: [],
          },
          {
            id: '1-14', // required. page ID
            title: '14. SIM Command', // required. Bread crumbs text
            menuName: '14. SIM Command', // required. Side bar text
            href: '/o11y-workshop-kr/src/1-ninja-kr/1-14-SIMCommand/1-14-index.html', // required. HTML file path
            prev: '1-12',
            next: '2',
            sub: [],
          },
        ],
      },
      // Ch2 - ITSI4Rookies
      {
        id: '2', // required. page ID
        title: 'Splunk Ninjas Workshop for ITSI', // required. Bread crumbs text
        menuName: 'Splunk Ninjas Workshop for ITSI', // required. Side bar text
        href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/1-index.html', // required. HTML file path
        prev: '1-14',
        next: '2-1',
        sub: [
          {
            id: '2-1', // required. page ID
            title: '2-1. Service Insights', // required. Bread crumbs text
            menuName: '2-1.Service Insights', // required. Side bar text
            href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-1-service-insights/2-1-index.html', // required. HTML file path
            prev: '2',
            next: '2-2',
            sub: [
              {
                id: '2-1-1', // required. page ID
                title: '2-1-1. Services', // required. Bread crumbs text
                menuName: '2-1-1. Services', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-1-service-insights/2-1-1-Services/2-1-1-index.html', // required. HTML file path
                prev: '2-1',
                next: '2-1-2',
              },
              {
                id: '2-1-2', // required. page ID
                title: '2-1-2. KPIs', // required. Bread crumbs text
                menuName: '2-1-2. KPIs', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-1-service-insights/2-1-2-KPIs/2-1-2-index.html', // required. HTML file path
                prev: '2-1-1',
                next: '2-1-3',
              },
              {
                id: '2-1-3', // required. page ID
                title: '2-1-3. Base Searches', // required. Bread crumbs text
                menuName: '2-1-3. Base Searches', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-1-service-insights/2-1-3-BaseSearches/2-1-3-index.html', // required. HTML file path
                prev: '2-1-2',
                next: '2-1-4',
              },
              {
                id: '2-1-4', // required. page ID
                title: '2-1-4. Implementing Services', // required. Bread crumbs text
                menuName: '2-1-4. Implementing Services', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-1-service-insights/2-1-4-ImplementService/2-1-4-index.html', // required. HTML file path
                prev: '2-1-3',
                next: '2-1-5',
              },
              {
                id: '2-1-5', // required. page ID
                title: '2-1-5. Entities', // required. Bread crumbs text
                menuName: '2-1-5. Entities', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-1-service-insights/2-1-5-Entities/2-1-5-index.html', // required. HTML file path
                prev: '2-1-4',
                next: '2-2',
              },
            ],
          },
          {
            id: '2-2', // required. page ID
            title: '2-2. Event Analytics', // required. Bread crumbs text
            menuName: '2-2. Event Analytics', // required. Side bar text
            href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-2-event-analytics/2-2-index.html', // required. HTML file path
            prev: '2-1-5',
            next: '2-2-1',
            sub: [
              {
                id: '2-2-1', // required. page ID
                title: '2-2-1. Thresholds', // required. Bread crumbs text
                menuName: '2-2-1. Thresholds', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-2-event-analytics/2-2-1-Thresholds/2-2-1-index.html', // required. HTML file path
                prev: '2-2',
                next: '2-2-2',
              },
              {
                id: '2-2-2', // required. page ID
                title: '2-2-2. Implementing Correlation Searchs', // required. Bread crumbs text
                menuName: '2-2-2. Implementing Correlation Searchs', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-2-event-analytics/2-2-2-Multi-KPI/2-2-2-index.html', // required. HTML file path
                prev: '2-2-1',
                next: '2-2-3',
              },
              {
                id: '2-2-3', // required. page ID
                title: '2-2-3. Aggregation Policies', // required. Bread crumbs text
                menuName: '2-2-3. Aggregation Policies', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-2-event-analytics/2-2-3-AggregationPolicies/2-2-3-index.html', // required. HTML file path
                prev: '2-2-2',
                next: '2-3',
              },
            ],
          },
          {
            id: '2-3', // required. page ID
            title: '2-3. Advanced Analytics', // required. Bread crumbs text
            menuName: '2-3. Advanced Analytics', // required. Side bar text
            href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-3-advanced-analytics/2-3-index.html', // required. HTML file path
            prev: '2-2-3',
            next: '2-3-1',
            sub: [
              {
                id: '2-3-1', // required. page ID
                title: '2-3-1. Anomaly Detection', // required. Bread crumbs text
                menuName: '2-3-1. Anomaly Detection', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-3-advanced-analytics/2-3-1-Anomalydetection/2-3-1-index.html', // required. HTML file path
                prev: '2-3',
                next: '2-3-2',
              },
              {
                id: '2-3-2', // required. page ID
                title: '2-3-2. Predictive Analytics', // required. Bread crumbs text
                menuName: '2-3-2. Predictive Analytics', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-3-advanced-analytics/2-3-2-PredictiveAnalytics/2-3-2-index.html', // required. HTML file path
                prev: '2-3-1',
                next: '2-3-3',
              },
              {
                id: '2-3-3', // required. page ID
                title: '2-3-3. And Others...', // required. Bread crumbs text
                menuName: '2-3-3. And Others...', // required. Side bar text
                href: '/o11y-workshop-kr/src/2-Splunk4NinjasITSI/2-3-advanced-analytics/2-3-3-AndOthers/2-3-3-index.html', // required. HTML file path
                prev: '2-3',
                next: '3',
              },
            ],
          },
        ],
      },
      // Ch3 - Advanced Collector Configuraiton
      {
        id: '3', // required. page ID
        title: 'Advanced Collector Configuraiton', // required. Bread crumbs text
        menuName: 'Advanced Collector Configuraiton', // required. Side bar text
        href: '/o11y-workshop-kr/src/3-advancedConfig/3-index.html', // required. HTML file path
        prev: '2-1-5',
        next: '3-0',
        sub: [
          {
            id: '3-0', // required. page ID
            title: 'Pre-requisites', // required. Bread crumbs text
            menuName: 'Pre-requisites', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-0-requirements/3-0-index.html', // required. HTML file path
            prev: '3',
            next: '3-1',
            sub: [],
          },
          {
            id: '3-1', // required. page ID
            title: '1. Agent Setup', // required. Bread crumbs text
            menuName: '1. Agent Setup', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-1-agentSetup/3-1-index.html', // required. HTML file path
            prev: '3',
            next: '3-1',
            sub: [],
          },
          {
            id: '3-2', // required. page ID
            title: '2. Gateway Setup', // required. Bread crumbs text
            menuName: '2. Gateway  Setup', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-2-gateway/3-2-index.html', // required. HTML file path
            prev: '3-1',
            next: '3-3',
            sub: [],
          },
          {
            id: '3-3', // required. page ID
            title: '3. Filelog Setup', // required. Bread crumbs text
            menuName: '3. Filelog  Setup', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-3-filelog/3-3-index.html', // required. HTML file path
            prev: '3-2',
            next: '3-4',
            sub: [],
          },
          {
            id: '3-4', // required. page ID
            title: '4. Building Resilience', // required. Bread crumbs text
            menuName: '4. Building Resilience', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-4-resilience/3-4-index.html', // required. HTML file path
            prev: '3-3',
            next: '3-5',
            sub: [],
          },
          {
            id: '3-5', // required. page ID
            title: '5. Dropping Spans', // required. Bread crumbs text
            menuName: '5. Dropping Spans', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-5-droppingSpan/3-5-index.html', // required. HTML file path
            prev: '3-4',
            next: '3-6',
            sub: [],
          },
          {
            id: '3-6', // required. page ID
            title: '6. Redacting Sensitive Data', // required. Bread crumbs text
            menuName: '6. Redacting Sensitive Data', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-6-sensitive/3-6-index.html', // required. HTML file path
            prev: '3-5',
            next: '3-7',
            sub: [],
          },
          {
            id: '3-7', // required. page ID
            title: '7. Transform Data', // required. Bread crumbs text
            menuName: '7. Transform Data', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-7-transform/3-7-index.html', // required. HTML file path
            prev: '3-6',
            next: '3-8',
            sub: [],
          },
          {
            id: '3-8', // required. page ID
            title: '8. Routing Data', // required. Bread crumbs text
            menuName: '8. Routing Data', // required. Side bar text
            href: '/o11y-workshop-kr/src/3-advancedConfig/3-8-routing/3-8-index.html', // required. HTML file path
            prev: '3-7',
            next: '3-9',
            sub: [],
          },
        ],
      },
      {
        id: '4', // required. page ID
        title: 'Real User Monitoring', // required. Bread crumbs text
        menuName: 'Real User Monitoring', // required. Side bar text
        href: '/o11y-workshop-kr/src/4-realUserMonitoring/4-index.html', // required. HTML file path
        prev: '3-8',
        next: '4-1',
      },
    ],
  },
];
