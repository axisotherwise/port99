import crawler from "../utils/crawler.js";
import path from "path";
import fileSystem from "fs"

const fs = fileSystem.promises;
const __dirname = path.resolve();

const indexRender = async (req, res, next) => {
    return res.render("index");
};

const success = async (req, res, next) => {
    return res.render("success");
}

const postRender = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const result = await crawler(email, password);

        const file = await fs.readFile(`./${email}.pdf`);

        if (file) {
            await fs.unlink(`./${email}.pdf`);
            return res.json("성공!");
        } else {
            return res.json("실패!");
        }
    } catch (err) {
        console.error(err);
        return next(err);
    }
};


export {
    indexRender,
    postRender,
    success,
}