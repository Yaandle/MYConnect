'use client';
import React, { useState } from 'react';
import styles from './dataset.module.css';
import Image from 'next/image';
import path from 'path';

const DatasetPage = () => {
  const [email, setEmail] = useState('');
  const [showDownload, setShowDownload] = useState(false);
  const [showGrapes, setShowGrapes] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowDownload(true);
  };

  const handleShowGrapes = () => {
    setShowGrapes(true);
    setShowDownload(false);
  };

  const handleShowApples = () => {
    setShowDownload(false);
    setShowGrapes(false);
  };

  const datasetPath = path.join(process.cwd(), 'Strawberry.v6i.yolov8 (1)');

  return (
    <div className={styles.container}>
      <h1 className={styles.largeHeading}>Download YOLOv8 Dataset</h1>
      <p className={styles.description}>
        Download our high-quality datasets for your machine learning projects.
      </p>
      <div className={styles.optionsContainer}>
        <button onClick={() => setShowDownload(false)} className={styles.option}>
          Strawberry
        </button>
        <button onClick={handleShowGrapes} className={styles.option}>
          Grapes
        </button>
      </div>
      <div className={styles.spacer} />
      {!showGrapes &&  (
        <>
          <h2 className={styles.heading}>Strawberry Dataset</h2>
          <div className={styles.datasetContainer}>
            <Image src="/strawberry.jpg" alt="Strawberry" width={300} height={200} />
          </div>
          <div className={styles.spacer} />
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Get Download Link
            </button>
          </form>
          {showDownload && (
            <div className={styles.downloadContainer}>
              <a href={`/${datasetPath}.zip`} download className={styles.downloadLink}>
                Download Strawberry Dataset
              </a>
            </div>
          )}
        </>
      )}
      {showGrapes && (
        <div>
          <h2 className={styles.heading}>Grapes Dataset</h2>
          <div className={styles.datasetContainer}>
            <Image src="/grapes.jpg" alt="Grapes" width={300} height={200} />
          </div>
          <div className={styles.spacer} />
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Get Download Link
            </button>
          </form>
          {showDownload && (
            <div className={styles.downloadContainer}>
              <a href={`/${datasetPath}_grapes.zip`} download className={styles.downloadLink}>
                Download Grapes Dataset
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatasetPage;