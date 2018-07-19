const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let obj = {};
let sourceDirectory = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter a directory name you want to searched: ', (dir1) => {
            fs.readdir(dir1, (err, file) => {
                if (err) {
                    reject('No such directory is found.\nClosing the terminal\nPlease Try Again')

                } else {
                    if (file.length === 0) {
                        reject(`No files are present in the directory.\nClosing the terminal\nPlease Try Again`);

                    } else {
                        console.log('\n**********FILES**********')
                        for (let i = 1; i < file.length + 1; i++) {
                            console.log(`${i}-${file[i-1]}`);
                        }
                        console.log('*************************\n')
                        obj.sourceDirectory = dir1;
                        obj.files = file;
                        resolve(obj)
                    }
                }
            });
        });
    })
}

let indexNumber = (obj) => {
    return new Promise((resolve, reject) => {
        rl.question('Enter a file index to be copied: ', (index) => {
            value = Number(index);
            if (!value) {
                reject('Enter a numeric Number.\nClosing the terminal\nPlease Try Again');

            } else if (index < 1 || index > obj.files.length) {
                console.log("You entered invalid index !");
                reject(`Please enter the value in range 1 to ${obj.files.length}\nClosing the terminal\nPlease Try Again`)

            } else {
                console.log(`\nSelected File: ${obj.files[index-1]}\n`);
                obj.selectedFile = obj.files[index - 1];
                resolve(obj);
            }
        });
    });
}

let destinationDirectory = (obj) => {
    return new Promise((resolve, reject) => {
        rl.question('Enter a destination folder ', (dir2) => {
            if (dir2 === obj.sourceDirectory) {
                reject('Destination directory is same as Source Directory.\nClosing the terminal\nPlease Try Again');

            } else if (dir2 === ''){
                reject('no directory found\nClosing the terminal\nPlease Try Again');

            } else if (!fs.existsSync(dir2)){
                reject(`Directory didn't exist.\nClosing the terminal\nPlease Try Again`)

            } else {
                obj.destinationDirectory = dir2;
                resolve(obj);
            }
        });
    })
}

let copyFile = (obj) => {
    return new Promise((resolve, reject) => {
        let readStream = fs.createReadStream(`${obj.sourceDirectory}/${obj.selectedFile}`)
        let writeStream = fs.createWriteStream(`${obj.destinationDirectory}/${obj.selectedFile}`)
        readStream.on('data', (chunk) => {
            writeStream.write(chunk)
        })
        readStream.on('end', () => {
            console.log('\nFile Read Complete')
            writeStream.end()
            console.log('\nFile Write Complete')
            resolve('\nEND')
        })
    })
}


sourceDirectory()
    .then(indexNumber)
    .then(destinationDirectory)
    .then(copyFile)
    .then((res) => {
        console.log(res);
        rl.close();
    }).catch((err) => {
        console.log(err);
        rl.close();
    })
