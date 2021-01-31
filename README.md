# Green
Elevator Pitch
Use CryptoGreen to make some extra money and help save the environment.

Inspiration
2020 brought upon us some of the worst economic hardships. Unemployment and evictions have been at an all time high.  Additionally, in contrast to popular belief, the pandemic has had many negative consequences to the environment including an increase in biomedical waste, safety equipment and haphazard disposal, and more municipal waste generation and reduction of recycling.  Moreover, plastic debris is predicted to double over the course of the next ten years with predictions only rising as a result of the abundant use of single-use plastics such as gloves and masks. In response to this, we have created a freelancing web platform (CryptoGreen) to bring awareness to and combat environmental problems while also allowing members of any community to earn a small amount of Crypto by completing tasks. 

Sources:
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7498239/#:~:text=Furthermore%2C%20it%20is%20reported%20that,combat%20against%20global%20climate%20change.
https://fas.org/sgp/crs/misc/R46554.pdf
https://www.sciencedirect.com/science/article/abs/pii/S1385894720328114

What It Does
Our web platform allows communities to work together to help the environment and each other financially.  “Employers” can first post a task on our user friendly map in any location in the world.  The employers can add any description or photos necessary to ensure clear cut steps on how to complete the task.  Also, the employers can add an additional reward to the task to provide further incentive for freelancers to do their task.  However, additional monetary rewards are not required as we will provide a base of 5 XLM as a reward for the completion of any task.  On the flip side, freelancers can use the map to claim a task they want to do.  Once they claim a task, they can message their employer using our convenient chat application for any additional detail the freelancer might need.  When the freelancer completes the task, they can mark the task as completed.  Then, the employer for that task must confirm the completion for the transaction to go through.  Users can check their balance, tasks, and personal information in their designated profile page. 

How We Built It
In this project, we primarily used javascript with the MERN (MongoDB, Express.js, React.js, and Node.js) stack.  For the frontend, we used React to build our pages and CSS, reactstrap, and react-bootstrap to style them for a good user interface.  To make the map, we utilized Leaflet.js.  On the backend side, we used Node, Express, and Axios to create our backend routes and API requests.  We used an extensive list of javascript web development libraries (outlined more fully in the Technology Stack Section).  In order to store our user information, we used the library mongoose to create models to send to our MongoDB database.

Challenges We Ran Into
In the beginning, we had a general category that we wanted to pursue: financial and environmental.  It was difficult to pinpoint a specific problem to center our project around.  In the end, we decided to go more broad and look at society as a whole.  This is how we came up with our idea.  For many of us, we were not as familiar with Javascript as we wanted to be.  We got stuck on a few errors for quite a while, most notably navigating with promises and async await statements.  This costed us a few hours searching the web for a solution that fit our code.  

Accomplishments We Are Proud Of
CryptoGreen is our most complex and complete project that we have ever made.  There are so many aspects that we needed to consider on all sides of development: frontend, backend, and database, and we managed to plan it all out successfully to make a working product.  Eventually, after long work hours, we created a freelancing platform that allows people to help the environment while earning some money.

What We Learned
On a more broad level, we became more familiar with cryptocurrency and the state of various crypto today.  We learned a lot about Stellar and how individual transactions work.  We also learned how to reduce the CSS code we had to write using the convenient styling keywords in bootstrap to directly put some of our styling in our javascript files instead of having hundreds of more lines of CSS code in our main app.css file.  Finally, efficiency was one of the most important takeaways from our experience.  We all learned how to more efficiently and effectively implement code and be more organized in terms of planning and setting up our tech stack.  

What Next For CryptoGreen
With the demand for economic stability and the major concern for our environment being at an all time high, our team plans to publicly release CryptoGreen as soon as possible.  We plan on tweaking some aspects of our project to account for scalability and extensibility.  We recognize that user privacy and security is also a huge concern, so we will implement safer methods for store and keeping user information.

As a base reward for completing a task, we are offering users a compensation of 5 XLM (although issuers of tasks can increase that!). However, before being able to expand our product to the public, we need to acquire enough assets to offer the 5 XLM to everyone. We hope to raise funds through a portal on our page and through crowdfunding websites. 

Technology Stack 
Frontend: React.js, Leaflet.js, CSS
Backend: Node.js, Express.js 
Database: MongoDB, Mongoose
Libraries: react-leaflet, reactstrap, react-bootstrap, @iconify, @fortawesome, @material-ui, mongoose, react-redux, redux, redux-thunk, axios, config, jsonwebtoken, bcryptjs, prop-types, 
API: OpenStreetMap
SDK: TalkJS, Stellar
