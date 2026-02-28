FROM node:20

WORKDIR /app

# Separate copying and installing dependencies from copying the entire project.
# This improves rebuild times - only the code changes, re-run the last COPY task. If dependencies change, re-run tasks starting from this COPY task.
COPY package.json package-lock.json ./

RUN npm install

# Copy from source directory to destination (working directory)
COPY . .

# This is metatdata that tells Docker what commands to run when instantiating this image (i.e running this image as a container)
# Using an array of commands is called "exec form." The other version without an array is called "shell form."
CMD ["npm", "start"]