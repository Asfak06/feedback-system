import { useRouter } from 'next/router';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { HandThumbsUp, HandThumbsDown } from 'react-bootstrap-icons';
import { API_BASE_URL, booths } from '../utils';
import Image from 'next/image';




function FeedbackForm() {
  const router = useRouter();
  const { boothNumber} = router.query;
  const [feedback, setFeedback] = useState({});
  const [vote, setVote] = useState(null);

  const onUpvote = () => {
    setVote('up');
  };

  const onDownvote = () => {
    setVote('down');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      boothNumber: router.query.boothNumber,
      vote: vote === 'up' ? 1 : -1,
      feedback: event.target.feedback.value ?? ""
    };

    if (!data.boothNumber || !data.vote) {
      alert('Missing data');
      return;
    }

    try {
      console.log(data);
      const res = await axios.post(`${API_BASE_URL}/api/feedback`, data);
      console.log(res.data);
      alert('Success');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center mt-4">
        <Image src={'/image2.png'} height={100} width={100} />
        <br/>
        <h1>জেলা প্রশাসকের কার্যালয়, ফরিদপুর</h1>
        <br/>
        <h3>মতামত বিভাগঃ <span className='text-danger'>{booths[boothNumber-1]}</span> </h3>
      </div>

      <Form onSubmit={handleSubmit}>
      <h5 className="text-center my-4">আমাদের সেবা নিয়ে সন্তুষ্ট হলে নিম্নের 👍 বাটন এ চাপ দিন, অসন্তুষ্ট হলে নিম্নের 👎 বাটন এ চাপ দিন</h5>  
        <Form.Group className="mb-3">
          <div className="d-flex align-items-center justify-content-center">
          <label className={`form-check-label d-flex align-items-center mx-3 ${vote === 'up' ? 'bg-success text-white' : 'bg-light'}`} style={{borderRadius: "8px", padding: "8px", cursor: "pointer"}} onClick={onUpvote}>
            <HandThumbsUp
              className={`mx-2 cursor-pointer ${vote === 'up' ? 'text-white' : 'text-success'}`}
              size={28}
            />
            <span>{vote === 'up' ? 'Liked' : 'Like'}</span>
          </label>
          <label className={`form-check-label d-flex align-items-center mx-3 ${vote === 'down' ? 'bg-danger text-white' : 'bg-light'}`} style={{borderRadius: "8px", padding: "8px", cursor: "pointer"}} onClick={onDownvote}>
            <HandThumbsDown
              className={`mx-2 cursor-pointer ${vote === 'down' ? 'text-white' : 'text-danger'}`}
              size={28}
            />
            <span>{vote === 'down' ? 'Disliked' : 'Dislike'}</span>
          </label>
        </div>
        </Form.Group>

        <Form.Group className="mb-3 d-flex justify-content-center">
          <div className="w-50">
            <Form.Control
              as="textarea"
              rows={3}
              name="feedback"
              onChange={handleInputChange}
              style={{width: "100%", textAlign: "center"}}
            />
          </div>
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="success" type="submit" className="rounded-pill" style={{width: "200px"}}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default FeedbackForm;
