# Kenan Backend
 Kenan Backend - Express JS Admin Backend created by [FrontSunriver](https://github.com/frontsunriver) and available on Github

## How to use Kenan Backend?

Clone the Kenan backend Repo(This repository is private repository):
```
git clone https://github.com/frontsunriver/kenan_back.git
```
```
cd kenan_back
```

##  🚀 Getting Started 

### Installation 👨🏻‍💻

1. Install all packages

```
npm install -g nodemon
```

```
npm install
```

2. Check configuration

###### First you need to check the configuration [/app/config/constant.js] and confirm the [PRODUCT_MODE] variable.

###### If product mode is 0 it's development mode and if product mode is 1 it's production mode.

3. Run your project

```
npm run start
```
Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

## Kenan Backend server deploy mode [Linux(Ubuntu)]

1. Install NVM

```
sudo su
```

```
apt-get install curl
```

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

```
source ~/.bashrc
```

2. Install Node.js

```
nvm install 20.18.0
```

```
nvm use 20.18.0
```

3. Download project and install packages [product_mode=1].

```
git clone https://github.com/frontsunriver/kenan_back.git
```

```
cd kenan_back
```

```
npm install -g pm2
```

```
npm install
```

4. Run your project forever mode

```
pm2 start server.js
```

5. Database (Mysql) configuration.

```
sudo su
```

```
apt-get update
```

```
apt-get install mysql-server
```

6. Connect database and create a new user

```
mysql -u root -p
```
We did not set any password currently so skip password.

```
use mysql;
```

```
CREATE USER 'kenandatabase'@'localhost' IDENTIFIED BY 'Kenan@12345';
```

```
GRANT ALL PRIVILEGES ON *.* TO 'kenandatabase'@'localhost' WITH GRANT OPTION;
```

```
ALTER USER 'kenandatabase'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Kenan@12345';
```

```
FLUSH PRIVILEGES;
```

7. Create database and Execute sql file

```
create database kenan_db;
```

```
use kenan_db;
```

Copy sql query to mysql command or restore mysqldump command

## Technical Support or Questions
If you have questions or need help integrating the product please [contact me](https://t.me/sunriver0217).
