const { Thought, User } = require('../models');

const thoughtController = {
//get all thoughts

getThoughts(req, res) {
    Thought.find()
    .sort({ createdAt: -1 })
    .then((dbThoughtData) => {
        res.json(dbThoughtData);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
},
//get a single thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'Thought with this ID does not exist.' });
        }
        res.json(dbThoughtData);
    })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
},

//create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought has been created but no user with this id' });
        }

      res.json({ message: 'Thought has been created' });
    })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
},

//update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'Thought with this ID does not exist.' });
        }
        res.json(dbThoughtData);
    })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
  },

//delete a thought
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'Thought with this ID does not exist.' });
        }

    //remove thought id from user's `thoughts` field
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought has been created but no user with this id' });
        }
        res.json({ message: 'Thought has been deleted' });
    })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
},

//add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'User with this ID does not exist.' });
        }
        res.json(dbThoughtData);
    })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
},

//remove reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'Thought with this ID does not exist.' });
        }
        res.json(dbThoughtData);
    })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
  },
};

module.exports = thoughtController;