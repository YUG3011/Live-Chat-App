import Conversation from "../Models/converationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch = async (req, res) => {
    try {
      const search = req.query.search || '';
      const currentUserId = req.user._id;
  
      const users = await User.find({
        $and: [
          {
            $or: [
              { username: { $regex: `.*${search}.*`, $options: 'i' } },
              { fullname: { $regex: `.*${search}.*`, $options: 'i' } }
            ]
          },
          {
            _id: { $ne: currentUserId }
          }
        ]
      })
        .select('-password')
        .select('email username fullname'); // include fields you want
  
      res.status(200).send(users);
  
    } catch (error) {
      console.error("Search Error:", error);
      res.status(500).send({ msg: 'Server error' });
    }
  };
  


 

export const getcurrentchatters = async (req, res) => {
  try {
    //  Correct the way you get current user ID
    const currentUserId = req.user._id;

    //  Find conversations where the current user is a participant
    const currentChatters = await Conversation.find({
      participants: currentUserId
    }).sort({ updatedAt: -1 });

    if (!currentChatters || currentChatters.length === 0) {
      return res.status(404).send({ msg: 'No chats found' });
    }

    //  Get all the other participant IDs
    const participantIds = currentChatters.reduce((ids, convo) => {
      const others = convo.participants.filter(
        id => id.toString() !== currentUserId.toString()
      );
      return [...ids, ...others];
    }, []);

    //  Remove duplicates
    const uniqueParticipantIds = [...new Set(participantIds.map(id => id.toString()))];

    //  Get users with those IDs
    const users = await User.find({ _id: { $in: uniqueParticipantIds } })
      .select('-password')
      .select('-email');

    res.status(200).send(users);

  } catch (error) {
    console.error('Error in getcurrentchatters:', error);
    res.status(500).send({ msg: 'Server error', error });
  }
};
