# tracks
A track app base on node js and docker.
The server will start with port `8080`

**Run on local**
1. cd to `./tracks-master/js`
2. Install the project dependencies `$ npm install`
3. Start the project with the command `$ npm start`
4. Open your browser and goto: `http://localhost:8080/`

**Build docker containers**

1. Install docker
   * mac https://docs.docker.com/docker-for-mac/
   * windows https://docs.docker.com/docker-for-windows/
   * Linux/ubuntu https://docs.docker.com/install/linux/docker-ce/ubuntu/
  
2. Clone repository, and run the `$ ./build.sh` in root folder, it will create an image named `tracks`.

  
3. Run the docker compose command in root folder `$ docker-compose up -d --force-recreate`, it should created a container `tracks_server_1` in the docker.


API Doc:

**Get tracks**
----
  Returns a json data for a list of 5 tracks, sorted by popularity.

* **URL**

  /:genre

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `{genre}`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **body:** 
    `[
      {
      “artist”: “Led Zeppelin”,
      “track”: “Babe I’m Gonna Leave You - 1990 Remaster”,
      “album_image_url”:“ https://i.scdn.co/image/12b952dadc9614a8893be2eb51
      7c6c5aea9f0ded ”,
      “release_date”:“1969-01-12”
      },
      ...
      ...
      {
      “artist”: “Led Zeppelin”,
      “track”: “Kashmir - 1990 Remaster”,
      “album_image_url”:“ https://i.scdn.co/image/28af597d86bf7bcbf9513695b0
      4cf7047ad7ae1f ”,
      “release_date”:“1975-02-24”
      }
    ]`
 
* **Error Response:**

  * **Code:** 400 Bad Request <br />
    **Content:** `{"success":false,"msg":"missing genre"}`
    
  * **Code:** 404 NOT FOUND <br />
    **Content:** `{"success":false,"msg":"can't found this genre"}`  
