import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const TASKS_COLLECTION = 'tasks';
const PROGRESS_COLLECTION = 'progress';
const REWARDS_COLLECTION = 'rewards';

// Tasks CRUD operations
export const taskService = {
  // Create new task
  async createTask(taskData) {
    try {
      const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get task by ID
  async getTask(taskId) {
    try {
      const docRef = doc(db, TASKS_COLLECTION, taskId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting task:', error);
      throw error;
    }
  },

  // Get all tasks
  async getAllTasks() {
    try {
      const q = query(collection(db, TASKS_COLLECTION), orderBy('time', 'asc'));
      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  // Update task
  async updateTask(taskId, updateData) {
    try {
      const docRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { id: taskId, ...updateData };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  async deleteTask(taskId) {
    try {
      const docRef = doc(db, TASKS_COLLECTION, taskId);
      await deleteDoc(docRef);
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

// Progress tracking operations
export const progressService = {
  // Save daily progress
  async saveProgress(progressData) {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const docRef = doc(db, PROGRESS_COLLECTION, today);

      await updateDoc(docRef, {
        ...progressData,
        updatedAt: serverTimestamp()
      }).catch(async () => {
        // If document doesn't exist, create it
        await addDoc(collection(db, PROGRESS_COLLECTION), {
          date: today,
          ...progressData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      return progressData;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  },

  // Get daily progress
  async getDailyProgress(date) {
    try {
      const docRef = doc(db, PROGRESS_COLLECTION, date);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting daily progress:', error);
      throw error;
    }
  },

  // Get progress history
  async getProgressHistory(limit = 30) {
    try {
      const q = query(
        collection(db, PROGRESS_COLLECTION),
        orderBy('date', 'desc'),
        limit(limit)
      );
      const querySnapshot = await getDocs(q);
      const progress = [];
      querySnapshot.forEach((doc) => {
        progress.push({ id: doc.id, ...doc.data() });
      });
      return progress;
    } catch (error) {
      console.error('Error getting progress history:', error);
      throw error;
    }
  }
};

// Rewards operations
export const rewardService = {
  // Get available rewards
  async getRewards() {
    try {
      const q = query(collection(db, REWARDS_COLLECTION), orderBy('points', 'asc'));
      const querySnapshot = await getDocs(q);
      const rewards = [];
      querySnapshot.forEach((doc) => {
        rewards.push({ id: doc.id, ...doc.data() });
      });
      return rewards;
    } catch (error) {
      console.error('Error getting rewards:', error);
      throw error;
    }
  },

  // Create reward
  async createReward(rewardData) {
    try {
      const docRef = await addDoc(collection(db, REWARDS_COLLECTION), {
        ...rewardData,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...rewardData };
    } catch (error) {
      console.error('Error creating reward:', error);
      throw error;
    }
  }
};

// Helper function to convert local tasks to Firebase format
export const migrateLocalTasks = async (localTasks) => {
  try {
    const migratedTasks = [];
    for (const timeSlot of localTasks) {
      const firebaseTask = {
        id: timeSlot.id,
        time: timeSlot.time,
        timeLabel: timeSlot.timeLabel,
        tasks: timeSlot.tasks
      };
      await taskService.createTask(firebaseTask);
      migratedTasks.push(firebaseTask);
    }
    return migratedTasks;
  } catch (error) {
    console.error('Error migrating local tasks:', error);
    throw error;
  }
};