import { useRouter } from 'next/router';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { HandThumbsUp, HandThumbsDown, EmojiSmile, EmojiFrown, EmojiNeutral } from 'react-bootstrap-icons';
import { API_BASE_URL, booths } from '../utils';
import Image from 'next/image';

function FeedbackForm() {
  const router = useRouter();
  const { boothNumber } = router.query;
  const [feedback, setFeedback] = useState({});
  const [vote, setVote] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [success, setSuccess] = useState(false);

  const onUpvote = () => {
    setVote('up');
  };

  const onDownvote = () => {
    setVote('down');
  };

  const onNeutralvote = () => {
    setVote('neutral');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      boothNumber: router.query.boothNumber,
      feedback: event.target.feedback.value ?? '',
    };
    if (!data.boothNumber || !vote) {
      alert('Missing or invalid input data');
      return;
    }

    if (data.feedback.length > 50) {
      alert('Feedback max character length 50');
      return;
    }

    try {
      if (phoneNumber !== '') {
        data.phoneNumber = phoneNumber;
      }
      data.vote = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;

      const res = await axios.post(`${API_BASE_URL}/api/feedback`, data);
      console.log(res.data);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  const handleReturnToForm = () => {
    setSuccess(false);
    setVote(null);
    setFeedback({});
    setPhoneNumber('');
  };

  return (
    <div className="container">
      {!success && (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <Image src={'/image2.png'} height={70} width={70} />
            <br />
            <h1>জেলা প্রশাসকের কার্যালয়, ফরিদপুর</h1>
            <br />
            <h3>
              <span className="text-danger">{booths[boothNumber - 1]}</span>
            </h3>
          </div>

          <Form onSubmit={handleSubmit}>
            <h5 className="text-center my-4">
               আপনার সুনির্দিষ্ট অভিমত আমাদের সেবার আগ্রহ আরো বাড়িয়ে দেবে।
            </h5>
            <Form.Group className="mb-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="text-center" style={{ color: vote === 'up' ? 'black' : 'gray' }}>
                  <Button
                    className={`form-check-label d-flex align-items-center mx-3 ${
                      vote === 'up' ? 'bg-success text-white' : 'bg-light'
                    }`}
                    style={{ borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
                    onClick={onUpvote}
                  >
                    <EmojiSmile size={46} color={vote === 'up' ? 'white' : '#27ae60'} />
                  </Button>
                
                  সন্তুষ্ট
                </div>


                <div className="text-center" style={{ color: vote === 'neutral' ? 'black' : 'gray' }}>
                  <Button
                    className={`form-check-label d-flex align-items-center mx-auto ${
                      vote === 'neutral' ? 'bg-warning text-white' : 'bg-light'
                    }`}
                    style={{ borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
                    onClick={onNeutralvote}
                  >
                    <EmojiNeutral size={46} color={vote === 'neutral' ? 'white' : '#f1c40f'} />
                  </Button>

                  সেবার মান বাড়াতে হবে
                </div>
                
                <div className="text-center" style={{ color: vote === 'down' ? 'black' : 'gray' }}>
                <Button
                  className={`form-check-label d-flex align-items-center mx-3 ${
                    vote === 'down' ? 'bg-danger text-white' : 'bg-light'
                  }`}
                  style={{ borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
                  onClick={onDownvote}
                >
                  <EmojiFrown size={46} color={vote === 'down' ? 'white' : '#c0392b'} />
                </Button>

                  অসন্তুষ্ট
                </div>
              </div>
            </Form.Group>


            <Form.Group className="mb-3 d-flex justify-content-center">
              <div className="w-50">
                <Form.Control
                  placeholder="আপনার পরামর্শ লিখুন (ঐচ্ছিক)"
                  as="textarea"
                  rows={3}
                  name="feedback"
                  onChange={handleInputChange}
                  style={{ width: '100%', textAlign: 'center' }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3 d-flex justify-content-center">
              <div className="w-50">
                <Form.Control
                  placeholder="মোবাইল নাম্বার (ঐচ্ছিক)"
                  as="input"
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{ width: '100%', textAlign: 'center' }}
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button variant="success" type="submit" className="rounded-pill" style={{ width: '200px' }}>
                Submit
              </Button>
            </div>
          </Form>
        </>
      )}
      {success && (
      <div className="d-flex flex-column justify-content-center align-items-center mt-4 vh-100">
        <h2>আপনার মতামত গ্রহন করা হয়েছে !</h2>
        <Button variant="primary" className="rounded-pill mt-3" onClick={handleReturnToForm}>
          Return to Form
        </Button>
      </div>
      )}
    </div>
  );
}

export default FeedbackForm;
