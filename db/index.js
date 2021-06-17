const Sequelize = require("sequelize");
const { STRING, UUID, UUIDV4, INTEGER } = Sequelize.DataTypes;

const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_tdd"
);

const Artist = conn.define("artist", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: STRING,
});

const Album = conn.define("album", {
  name: STRING,
});

const Song = conn.define("song", {
  name: STRING,
  duration: STRING,
});

const Track = conn.define("track", {
  idx: INTEGER,
  name: STRING,
});

Artist.hasMany(Album);
Artist.hasMany(Song);

Song.belongsTo(Artist);
Album.belongsTo(Artist);

Song.hasMany(Track);
Album.hasMany(Track);

Track.belongsTo(Song);
Track.belongsTo(Album);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [weeknd, metalica, adele] = await Promise.all([
    Artist.create({ name: "The Weeknd" }),
    Artist.create({ name: "Metalica" }),
    Artist.create({ name: "Adele" }),
  ]);

  const [starboy, nineteen, metallica] = await Promise.all([
    Album.create({ name: "Starboy" }),
    Album.create({ name: "Nineteen" }),
    Album.create({ name: "Metallica" }),
  ]);

  const secrets = await Song.create({
    name: "Secrets",
    duration: "2:00",
    artistid: weeknd.id,
  });

  const sandman = await Song.create({
    name: "Sandman",
    duration: "2:00",
    artistId: metalica.id,
  });
  const daydreamer = await Song.create({
    name: "Daydreamer",
    duration: "2:00",
    artistId: adele.id,
  });

  const secretsTrack = await Track.create({
    name: secrets.name,
    idx: 1,
    albumId: starboy.id,
    songId: secrets.id,
  });

  const sandmanTrack = await Track.create({
    name: sandman.name,
    idx: 1,
    albumId: metallica.id,
    songId: sandman.id,
  });

  const daydreamerTrack = await Track.create({
    name: daydreamer.name,
    idx: 1,
    albumId: nineteen.id,
    songId: daydreamer.id,
  });

  return {
    artists: {
      weeknd,
      metalica,
      adele,
    },
  };
};

module.exports = {
  syncAndSeed,
  models: {
    Artist,
    Album,
    Song,
    Track,
  },
};
