# Shlok Bhakta's Website!!

[Website Link](https://shlokbhakta.dev/)

## 📃 What this site is

Its a place for me to goof off and express my creativity and any passion projects I work on. It has a blog and possibly may have a way to sign up with emails if I'm feeling like it. Everything for this site has been a massive learning experience from the CI/CD, to the deployment on my own servers, and even just the website itself. I am super excited to get the party started and ground zero is this website

## 🤤 I want it!

You can host it with docker! All the files are statically generated so ell the content including blog posts, projects, images, my resume, and everything else is all neatly bunded inside a docker container for you to pull, run, and enjoy locally if you feel like it I guess. This is mostly just for me incase I misplace the deploy compose file in the future lol

single command
```bash
docker run -d -p 8080:8080 ghcr.io/shlok-bhakta/portfolio-site:latest
```

[docker-compose](https://docs.docker.com/compose/)
```yaml
version: "3.8"
services:
  site:
    image: ghcr.io/shlok-bhakta/portfolio-site:latest
    restart: unless-stopped
    ports:
      - 8080:8080 # change to whatever
```

Full service frontend and back
```yaml
version: "3.8"
services:
  site:
    image: ghcr.io/shlok-bhakta/portfolio-site:latest
    restart: unless-stopped
    ports:
      - 23454:8080
  pb:
    image: ghcr.io/muchobien/pocketbase:latest
    hostname: pocketbase
    restart: unless-stopped
    ports:
      - 5432:8090
    volumes:
      - /home/shlok/pocketBaseWebsiteTest/data:/pb_data
      - /home/shlok/pocketBaseWebsiteTest/pub:/pb_public
networks: {}
```

Hope yall enjoy exploring what I do!