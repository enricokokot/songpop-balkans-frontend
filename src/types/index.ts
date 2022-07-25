export type RoundDetails = {
  correctAnswer: string;
  answers: string[];
  rivalAnswer: string;
  rivalAnswerTime: number;
  isOver: boolean;
};

export type Playlist = {
  _id: {};
  id: number;
  title: string;
  details: string;
  price: number;
  songs: string[];
};

export type Round = {
  songs: string[];
  correctAnswer: string;
  correctAnswerId: string;
  playerTimeAnswered: number;
  playerPointsEarned: number;
  playerAnswer: string;
  // these below could be optional
  pointsEarned: number;
  timeAnswered: number;
  answer: string;
};

export type Rounds = { [key: number]: Round };

export type DuelAgainst = {
  id: string;
  name: string;
  status: string;
  offeredAnswers: string[][];
  correctAnswers: string[];
  correctAnswersIds: string[];
  _id: string;
  startTime: number;
  playlist: string;
  resultSoFar: number[];
  duel: Duel;
  appendedAchievement: { id: number; text: string };
  score: number[];
  time: number;
  rounds: { [key: number]: Round };
  challengerId: string;
  challengeTakerId: string;
};

export type Duel = {
  id: string;
  _id: string;
  time: number;
  rounds: { [key: number]: Round };
  playlist: string;
  offeredAnswers: string[][];
  correctAnswers: string[];
  correctAnswersIds: string[];
  challengerId: string;
  challengeTakerId: string;
};

export type User = {
  id: string;
  name: string;
  achievements: [];
  pointsEarned: number[];
  givenAnswers: string[];
  answerTimes: number[];
  appendedAchievement: { id: number; text: string };
};

export type Rival = {
  id: string;
  appendedAchievement: { id: number; text: string };
  pointsEarned: number[];
  givenAnswers: string[];
  answerTimes: number[];
  name: string;
};

export type Player = {
  id: {};
  name: string;
  duel: Duel;
  score: number[];
  status: string;
  appendedAchievement: {
    id: number;
    text: string;
  };
};

export type PlayerRaw = {
  _id: string;
  achievements: Achievement[];
  appendedAchievement: number;
  challenge: string[];
  coins: number;
  duels: string[];
  friends: string[];
  "games lost": number;
  "games played": number;
  "games tied": number;
  "games won": number;
  password: string;
  playlists: string[];
  reply: string[];
  username: string;
  waiting: string[];
};

export type Achievement = {
  id: number;
  mission: string;
  progress: number;
  total: number;
};

export type Rivalry = {
  _id: string;
  playerOneId: string;
  playerTwoId: string;
  playerOneScore: number;
  playerTwoScore: number;
};
