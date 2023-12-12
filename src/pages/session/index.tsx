import { useState } from 'react';
import Nav from '../../components/Nav';
import styles from '../../styles/CreateSession.module.css';
import lighthouse from '@lighthouse-web3/sdk';
import { useAccount } from "wagmi";

export default function CreateSession(): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [tokenid, setTokenId] = useState<string>('');
  const [metadata, setMetadata] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const { address } = useAccount();

  const progressCallback = (progressData: { total: number, uploaded: number }) => {
    const cal = (progressData?.total / progressData?.uploaded)?.toFixed(2);
    let percentageDone = 100 - parseInt(cal);
    console.log("PERCENTAGE UPLOAD", percentageDone);
  };

  async function uploadImage(e: any) {
    try {
      console.log("Image Upload Started")
      if (e.target.files[0].size < 30097152) {
        console.log(e.target.files);
        const output = await lighthouse.upload(e, '8d7637a6-5059-4ee0-b086-d2bdc4aeb69a', progressCallback);
        console.log('File Upload Status:', output);
        const url = `https://ipfs.io/ipfs/${output.data.Hash}`
        setImage(url)
        console.log("UPLOADED IMAGE IPFS URL", url);
      }
      else {
        alert("File is too big!");

      }
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function uploadToIPFS() {
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name: title, description: content, image, price, content, tags, duration, type, tokenid, creator: address, 
    })
    try {

      const metadata = await lighthouse.uploadText(data, '8d7637a6-5059-4ee0-b086-d2bdc4aeb69a')
      //const added = await client.add(data)
      const url = `https://ipfs.io/ipfs/${metadata.data.Hash}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      console.log("UPLOADED METADATA IPFS URL", url);
      setMetadata(url);
      return url

    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // reset error and message
    setError('');
    setMessage('');

    // fields check
    if (!title || !content) return setError('All fields are required');

    const metadataurl = await uploadToIPFS();

    // post structure
    const post = {
      title,
      content,
      price,
      tags,
      duration,
      type,
      image,
      tokenid,
      metadata: metadataurl,
      creator: address,
      published: false,
      createdAt: new Date().toISOString(),
    };

    // save the post
    const response = await fetch('/api/session', {
      method: 'POST',
      body: JSON.stringify(post),
    });

    // get the data
    const data = await response.json();

    if (data.success) {
      // reset the fields
      setTitle('');
      setContent('');
      setPrice(''),
      setTags(''),
      setDuration(''),
      setType(''),
      setImage(''),
      setTokenId(''),
      setMetadata('')
      // set the message
      return setMessage(data.message);
    } else {
      // set the error
      return setError(data.message);
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <form onSubmit={handlePost} className={styles.form}>
          {error ? (
            <div className={styles.formItem}>
              <h3 className={styles.error}>{error}</h3>
            </div>
          ) : null}
          {message ? (
            <div className={styles.formItem}>
              <h3 className={styles.message}>{message}</h3>
            </div>
          ) : null}
          <div className={styles.formItem}>
            <label>Image</label>
            <input
              type='file'
              name="Image"
              onChange={uploadImage}
            />
          </div>
          <div className={styles.formItem}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="title"
            />
          </div>
          <div className={styles.formItem}>
            <label>Content</label>
            <textarea
              name="content"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Post content"
            />
          </div>
          <div className={styles.formItem}>
            <label>Price</label>
            <input
              type="number"
              name="Price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              placeholder="Price"
            />
          </div>
          <div className={styles.formItem}>
            <label>Tags</label>
            <input
              type="text"
              name="Tags"
              onChange={(e) => setTags(e.target.value)}
              value={tags}
              placeholder="Tags"
            />
          </div>
          <div className={styles.formItem}>
            <label>Duration</label>
            <select name="Duration" id="duration" onChange={(e) => setDuration(e.target.value)}>
              {duration ? <option value={duration}>{duration} Min</option> : <option>Select</option>}
              <option value="30">30 Min</option>
              <option value="60">60 Min</option>
            </select>
          </div>
          <div className={styles.formItem}>
            <label>NFT Type</label>
            <select name="Type" id="type" onChange={(e) => setType(e.target.value)}>
              {type ? <option value={type}>ERC {type}</option> : <option>Select</option>}
              <option value="721">ERC 721</option>
              <option value="1155">ERC 1155</option>
            </select>
          </div>
          <div className={styles.formItem}>
            <label>TokenId</label>
            <input
              type="number"
              name="TokenId"
              onChange={(e) => setTokenId(e.target.value)}
              value={tokenid}
              placeholder="TokenId"
            />
          </div>
          <div className={styles.formItem}>
            <label>Creator</label>
            <textarea
              name="Creator"
              value={address}
              disabled
            />
          </div>
          <div className={styles.formItem}>
            <button type="submit">Create Session</button>
          </div>
        </form>
      </div>
    </div>
  );
}