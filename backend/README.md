# InfoBytes Backend

## NestJS

This backend utilizes NestJS. 

**[Docs](https://docs.nestjs.com/)**

## Deployment

1. Create new tag in github.
2. Download the zip with the new version.

3. SSH into the machine

        ssh -i "infobytes-servers-key.pem" ubuntu@ec2-18-192-124-201.eu-central-1.compute.amazonaws.com

4. Stop the already running version

        lsof -i :3000

    Locate the [PID]

        kill <PID>

5. Upload Version

        sudo scp -i ~/Documents/infobytes-servers-key.pem infobytes-[VERSION].zip ubuntu@ec2-18-192-124-201.eu-central-1.compute.amazonaws.com:/home/ubuntu

Unzip the archive

        unzip infobytes-[VERSION].zip

6. Copy .env.prod to .env

        cp .env.prod .env

7. Run prisma migrations on Production DB

        npx prisma migrate deploy

8. Build the backend
          
        yarn build

9.  Start the backend with nohup and redirect logs to logs file.

        nohup yarn start > ../backend.log 2>&1 &

---

## Reading logs:

      colortail backend.log