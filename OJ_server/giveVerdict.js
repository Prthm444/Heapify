const { executeCpp } = require("./executeCpp");

const giveVerdict=async (req,res)=>{

    const { language = "cpp", code } = req.body;
	if (code === undefined) {
		return res.status(404).json({ success: false, error: "Empty code!" });
	}
	try {
		const filePath = generateFile(language, code);
		const output = await executeCpp(filePath);
		res.json({ filePath, output });
	} catch (error) {
		res.status(500).json({ error: error });
	}

}