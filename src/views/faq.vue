<template>
  <div class="faq-container container my-5">
<h1 class="ml5 d-flex justify-content-center mb-5">
  <span class="text-wrapper">
    <span class="line line1"></span>
    <span class="letters letters-left">Frequently</span>
    <span class="letters ampersand">Asked</span>
    <span class="letters letters-right">Questions</span>
    <span class="line line2"></span>
  </span>
</h1>

    <div class="accordion" id="faqAccordion">
      <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
        <div class="card mb-3 border-0 shadow-sm">
          <div class="card-header p-3" id="heading{{ index }}">
            <h2 class="mb-0">
              <button class="btn btn-link d-flex justify-content-between align-items-center w-100"
                      @click="toggleAnswer(index)"
                      :aria-expanded="faq.show"
                      :aria-controls="'collapse' + index">
                {{ faq.question }}
                <i :class="faq.show ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </button>
            </h2>
          </div>
          <transition name="expand">
            <div v-if="faq.show" class="card-body px-4">
              <p>{{ faq.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import anime from 'animejs/lib/anime.es.js';

export default {
  name: "FAQ",
  data() {
    return {
      faqs: [
        // Add your FAQ content here
        {
            question: "How do I register for an account?",
            answer: "You can register for an account by navigating to the signup page and filling out the registration form with your details.",
            show: false
          },
          {
            question: "How do I log in to my account?",
            answer: "You can log in to your account by navigating to the login page and entering your email and password.",
            show: false
          },
          {
            question: "What should I do if I forget my password?",
            answer: "If you forget your password, you can use the 'Forgot Password' link on the login page to reset it.",
            show: false
          },
          {
            question: "How do I verify my email address?",
            answer: "After registering, you will receive a verification email. Please click the link in the email to verify your address.",
            show: false
          },
          {
            question: "How can I update my profile information?",
            answer: "You can update your profile information by navigating to your account settings and editing your details.",
            show: false
          },
          {
            question: "How do I purchase tickets for an event?",
            answer: "You can purchase tickets by browsing the events, selecting the desired event, and following the purchase process.",
            show: false
          },
          {
            question: "How can I view my purchase history?",
            answer: "You can view your purchase history by navigating to the 'Purchase History' section in your account.",
            show: false
          },
          {
            question: "What payment methods are accepted?",
            answer: "We accept various payment methods including credit/debit cards and PayPal.",
            show: false
          },
          {
            question: "How do I contact customer support?",
            answer: "You can contact customer support by using the contact form on our website or by emailing support@example.com.",
            show: false
          },
          {
            question: "How do I enable dark mode?",
            answer: "You can enable dark mode by toggling the dark mode switch in the sidebar or navbar.",
            show: false
          },
          {
            question: "How do I log out of my account?",
            answer: "You can log out of your account by clicking the logout button in the sidebar or account settings.",
            show: false
          },
          {
            question: "How do I filter events in the marketplace?",
            answer: "You can filter events by categories, price, and date using the filter options in the marketplace section.",
            show: false
          },
          {
            question: "How do I add an event to my cart?",
            answer: "You can add an event to your cart by selecting the event and clicking the 'Add to Cart' button.",
            show: false
          },
          {
            question: "How do I view event details?",
            answer: "You can view event details by clicking on the event in the events list, which will take you to the event details page.",
            show: false
          },
          {
            question: "How do I use the AI chatbot?",
            answer: "The AI chatbot is available on every page of the website. You can interact with it by clicking the chatbot icon and typing your query.",
            show: false
          }
      ]
    };
  },
  methods: {
    toggleAnswer(index) {
      this.faqs[index].show = !this.faqs[index].show;
    }
  },
mounted(){
anime.timeline({loop: true})
  .add({
    targets: '.ml5 .line',
    opacity: [0.5,1],
    scaleX: [0, 1],
    easing: "easeInOutExpo",
    duration: 700
  }).add({
    targets: '.ml5 .line',
    duration: 600,
    easing: "easeOutExpo",
    translateY: (el, i) => (-0.625 + 0.625*2*i) + "em"
  }).add({
    targets: '.ml5 .ampersand',
    opacity: [0,1],
    scaleY: [0.5, 1],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=600'
  }).add({
    targets: '.ml5 .letters-left',
    opacity: [0,1],
    translateX: ["0.5em", 0],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=300'
  }).add({
    targets: '.ml5 .letters-right',
    opacity: [0,1],
    translateX: ["-0.5em", 0],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=600'
  }).add({
    targets: '.ml5',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 2000
  });
}
};
</script>

<style scoped>
.ml5 {
  position: relative;
  font-weight: 300;
  font-size: 4em; /* Adjust this for desired text size */
  color: #402d2d;
  text-align: center;
  margin-bottom: 1.5rem;
}

.ml5 .text-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  line-height: 1em;
}

.ml5 .letters {
  display: inline-block;
  opacity: 0;
}

.ml5 .letters-left,
.ml5 .letters-right {
  padding: 0 0.2em; /* Increase padding to add space between words */
}

.ml5 .ampersand {
  font-family: Baskerville, serif;
  font-style: italic;
  font-weight: 400;
  width: auto;
  font-size: 1.2em; /* Optional: Make "Asked" slightly larger */
}

.ml5 .line {
  position: absolute;
  left: 0;
  top: 50%;
  height: 3px;
  width: 100%;
  background-color: #402d2d;
  transform-origin: center;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  transition: transform 0.3s, background-color 0.3s;
}

.card-header {
  background-color: #2c647c;
  color: #fff;
  cursor: pointer;
  padding: 1rem 1.5rem;
  font-weight: bold;
  font-size: 1.25rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.card-header:hover {
  background-color: #2c647c;
}

.card-body {
  background-color: #f1f1f1;
  padding: 1.5rem;
}

.faq-item {
  margin-bottom: 1rem;
}

.btn-link {
  color: inherit;
  text-decoration: none;
  font-weight: bold;
}

.btn-link:focus {
  outline: none;
}

i {
  font-size: 1.2rem;
  transition: transform 0.2s;
}
</style>