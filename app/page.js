'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [total, setTotal] = useState(0);

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      try {
        await addDoc(collection(db, 'items'), {
          name: newItem.name.trim(),
          price: newItem.price,
        });
        setNewItem({ name: '', price: '' });
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Calculate total from itemsArr
      const totalPrice = itemsArr.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );
      setTotal(totalPrice);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 bg-custom-image'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm'>
        <h1 className='text-4xl p-4 text-center text-black font-bold bg-gray-400'>PANTRY TRACKER</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border text-black'
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className='col-span-2 p-3 border mx-3 text-black'
              type='number'
              placeholder='Enter $'
            />
            <button
              onClick={addItem}
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl font-bold'
              type='submit'
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className='my-4 w-full flex justify-between bg-slate-700 rounded'
              >
                <div className='p-4 w-full flex justify-between text-white font-bold'>
                  <span className='capitalize'>{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-8 p-4 border-l-2 border-slate-600 hover:bg-slate-600 w-16 text-white'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ''
          ) : (
            <div className='flex justify-between p-3 text-white font-bold'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
