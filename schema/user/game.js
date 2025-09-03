const Joi = require("joi");

const userCreateGameSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    price: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    totalPlayers: Joi.number().required(),
    totalSteps: Joi.number().required(),
    gameType: Joi.string().required(),
    gamedescription: Joi.string().required(),
    gameTitle: Joi.string().required(),
    gameCode: Joi.string().required(),
    gameDuration: Joi.string().required(),
  }),
});

const userJoinGameSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    gameId: Joi.string().required(),
  }),
  body: Joi.object({
    gameCode: Joi.string().required(),
  }),
});

module.exports={
    userCreateGameSchema,
    userJoinGameSchema
};