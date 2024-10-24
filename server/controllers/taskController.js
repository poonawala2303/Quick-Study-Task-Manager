const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({
      title,
      description,
      user: req.user.id
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// const Task = require('../models/Task');

// exports.deleteTask = async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);
        
//         if (!task) {
//             return res.status(404).json({ msg: 'Task not found' });
//         }

//         // Check if user owns this task
//         if (task.user.toString() !== req.user.id) {
//             return res.status(401).json({ msg: 'Not authorized' });
//         }

//         await Task.findByIdAndDelete(req.params.id);
        
//         res.json({ msg: 'Task removed' });
//     } catch (err) {
//         console.error('Delete task error:', err);
//         res.status(500).json({ msg: 'Server Error' });
//     }
// };