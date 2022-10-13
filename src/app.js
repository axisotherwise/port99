import express from "express";
import nunjucks from "nunjucks";

import indexRoutes from "./routes/index.js";

const app = express();

app.set("port", 1000);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRoutes);

app.use((req, res, next) => {
    const error = new Error(`${req.url} ${req.method} 존재하지 않아요.`);
    error.status = 404;

    return next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = err;
    res.status(err.status || 500);

    return res.render("error");
});

app.listen(app.get("port"), () => console.log(1000));