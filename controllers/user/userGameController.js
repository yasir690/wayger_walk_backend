const prisma = require("../../config/prismaConfig");
const { ValidationError, NotFoundError } = require("../../resHandler/CustomError");
const { handlerOk } = require("../../resHandler/responseHandler");
const { generateOtp } = require("../../utils/generateOtp");

const createGame=async (req,res,next) => {
    try {
        const {id}=req.user;
        const {price,startDate,endDate,startTime,endTime,gameType,gamedescription,gameTitle,gameDuration}=req.body;
        const file = req.file;

        console.log(req.body);
        

        const otp = generateOtp();

        const filePath = file.filename; // use filename instead of path
        const basePath = `http://${req.get("host")}/public/uploads/`;
        const gameimage = `${basePath}${filePath}`;

        const game=await prisma.game.create({
            data:{
                createdById: id,
                gamePrice:Number(price),
                startDate:new Date(startDate),
                endDate:new Date(endDate),
                startTime,
                endTime,
                gameType,
                gameDescription:gamedescription,
                gameTitle,
                gameCode:otp,
                gameDuration,
                image:gameimage,
                  totalPlayers: {
          connect: [{ id }], // ✅ connect creator as first participant
        },
                totalSteps: 0,    
            },
            include: {
        totalPlayers: true, // optional: to return full player details
      },
        });

        if(!game){
            throw new ValidationError("game not create");
        }

        handlerOk(res,201,game,"game created successfully")

    } catch (error) {
        next(error)
    }
}

const showGames=async (req,res,next) => {
    try {

        const games=await prisma.game.findMany({
           include:{
            totalPlayers: true,
           }
        });

        if(games.length===0){
            throw new ValidationError("no game found");
        }

        handlerOk(res,200,games,"games found successfully");

    } catch (error) {
        next(error)
    }
}

const joinGame=async (req,res,next) => {
    try {
        const {id}=req.user;
        const {gameId}=req.params;
        const {gameCode}=req.body;

        const game=await prisma.game.findUnique({
            where:{
                id:gameId,
                gameCode:gameCode
            },
            include: {
        totalPlayers: true,
      },
        });

        if(!game){
            throw new NotFoundError("game or game code not found");
        }

        if(game.createdById===id){
            throw new ValidationError("you cannot join your own game");
        }

          // Initialize array if null
    const currentPlayers = Array.isArray(game.totalPlayers) ? game.totalPlayers : [];

     // Restrict based on gameType
    if (game.gameType === "ONEONONE" && currentPlayers.length >= 2) {
      throw new ValidationError("This one-on-one game is already full");
    }

    // Prevent duplicate join
    if (currentPlayers.includes(id)) {
      throw new ValidationError("You have already joined this game");
    }

    

    
        const updatedGame=await prisma.game.update({
            where:{
                id:gameId,
            },
            data:{
                 totalPlayers: {
          connect: { id },
        },
            },
            include: {
        totalPlayers: true,
      },
        })



        handlerOk(res,200,updatedGame,"game joined successfully")



    } catch (error) {
        next(error)
    }
}


module.exports={
    createGame,
    showGames,
    joinGame
}