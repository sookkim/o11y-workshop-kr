# Dockerize the Application

이제 Java application을 Kubernetes cluster에 배포해보려고 합니다.

그 전에 무엇을 해야할까요?

첫번째로 우리의 application을 Docker image로 생성해야합니다. "dockerizing" 혹은 "도커 이미지로 만다" 라는 이 표현은 `Dockerfile` 으로부터 생성됩니다.

## Key Terms

### 도커란 무엇인가요?

_"Docker provides the ability to package and run an application in a loosely isolated environment
called a container. The isolation and security lets you run many containers simultaneously on
a given host. Containers are lightweight and contain everything needed to run the application,
so you don't need to rely on what's installed on the host."_

Source: https://docs.docker.com/get-started/docker-overview/

### 컨테이너란 무엇인가요?

_"Containers are isolated processes for each of your app's components. Each component
...runs in its own isolated environment,
completely isolated from everything else on your machine."_

Source: https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/

### 컨테이너 이미지는 무엇인가요?

_"A container image is a standardized package that includes all of the files, binaries,
libraries, and configurations to run a container."_

### Dockerfile

_"A Dockerfile is a text-based document that's used to create a container image. It provides
instructions to the image builder on the commands to run, files to copy, startup command, and more."_

## Create a Dockerfile

`Dockerfile`을 생성해봅시다.
사실 1-2 DeployJavaApp 과정에 `/hello-world` 폴더에 Dockerfile을 생성했었습니다.

```bash
vi ~/hello-world/Dockerfile
```

```dockerfile
FROM openjdk:17-jdk-slim

# 작업 디렉터리 설정
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY ./target/hello-world-0.0.1-SNAPSHOT.jar app.jar

# 앱 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

# 8080 포트 오픈
EXPOSE 8080
```

### The Build Stage

위의 Dockerfile을 build해 봅시다. 이 과정에서 우리는 `openjdk:17-jdk-slim` 이미지를 사용합니다.

리눅스 서버에서 java를 실행했던것과 유사하게 openjdk 이미지에서도 java를 동일하게 실행하면 됩니다.
이때 `ENTRYPOINT` 라는 command를 사용합니다.

docker daemon 이 기동되어 있는지 확인합니다.

```bash
sudo systemctl status docker

## docker daemon이 running 상태가 아니면 start 합니다.
sudo systemctl start docker
```


```bash
docker build -t hello-world-app:1.0 .

docker images

REPOSITORY        TAG       IMAGE ID       CREATED         SIZE
hello-world-app   1.0       1eb720191cbc   8 minutes ago   428MB
```

> [!warning]
> docker 데몬이 실행되고있지 않다는 에러가 뜬다면 아래 명령어로 도커를 실행시킨 뒤에 build를 수행하세요
>
> sudo systemctl start docker

위의 명령어를 통해 Dockerfile의 정보를 바탕으로 `hello-world-app:1.0`라는 이미지가 생성되었습니다.

## Test the Docker Image

> 해당 과정이 진행되기 전 서버에서 작동되는 어플리케이션은 중지해 줍니다. 포트 충돌 시 다음의 명령어를 참고해 사용중인 포트를 중지해 주세요.

```bash
lsof -i:8080
sudo kill -9 [PID]
```

다음의 command를 통해 생성한 이미지를 실행합니다.

```bash
docker run -d -p 8080:8080 --name hello-world-container hello-world-app:1.0
```

Docker container가 잘 작동되는지 확인

```bash
docker ps
```

이전 처럼 curl 명령을 통해 application에 접속 가능

```bash
$ curl http://localhost:8080/hello/Docker
Hello, Docker!
```

축하드립니다! 해당 과정을 통해 Java Application을 docker로 작동시켰습니다. 🎉
