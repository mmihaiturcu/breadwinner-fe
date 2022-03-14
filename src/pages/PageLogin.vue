<template>
    <q-page class="column items-center justify-center">
        <div class="authentication-container column logo-title relative">
            <div>
                <div
                    class="breadwinner-title text-h1 text-uppercase text-center accent text-accent gentona-bold"
                >
                    Breadwinner
                </div>
                <Logo class="breadwinner-logo absolute-center" />
            </div>

            <div class="authentication-form-container row justify-center">
                <AuthenticationForm />
            </div>
        </div>
        <TwoFATokenModal v-if="showInput2FATokenModal" />
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Logo from 'src/components/Logo.vue';
import gsap, { Linear, Back, Power1 } from 'gsap';
import AuthenticationForm from 'src/components/authentication/AuthenticationForm.vue';
import { doNothing } from 'src/utils/helper';
import TwoFATokenModal from '../components/authentication/TwoFATokenModal.vue';
import { useUserStore } from 'src/stores';
import { storeToRefs } from 'pinia';

export default defineComponent({
    name: 'PageLogin',
    components: {
        Logo,
        AuthenticationForm,
        TwoFATokenModal,
    },
    setup() {
        const userStore = useUserStore();
        const { showInput2FATokenModal } = storeToRefs(userStore);
        const winHeight = window.innerHeight,
            winWidth = window.innerWidth;

        return {
            density: 50,
            speed: 2,

            start: {
                yMin: winHeight - winHeight,
                yMax: winHeight,
                xMin: winWidth / 2 + 10,
                xMax: winWidth / 2 + 40,
                scaleMin: 0.1,
                scaleMax: 0.25,
                scaleXMin: 0.1,
                scaleXMax: 1,
                scaleYMin: 1,
                scaleYMax: 2,
                opacityMin: 0.1,
                opacityMax: 0.4,
            },
            mid: {
                yMin: winHeight * 0.4 - winHeight,
                yMax: winHeight * 0.9 - winHeight,
                xMin: winWidth * 0.1,
                xMax: winWidth * 0.9,
                scaleMin: 0.2,
                scaleMax: 0.8,
                opacityMin: 0.5,
                opacityMax: 1,
            },
            end: {
                yMin: -180 - winHeight,
                yMax: -180 - winHeight,
                xMin: -100,
                xMax: winWidth + 180,
                scaleMin: 0.1,
                scaleMax: 1,
                opacityMin: 0.4,
                opacityMax: 0.7,
            },
            showInput2FATokenModal,
        };
    },
    methods: {
        range(min: number, max: number) {
            return min + (max - min) * Math.random();
        },
        sign() {
            return Math.random() < 0.5 ? -1 : 1;
        },
        randomEase(easeThis: gsap.EaseFunction, easeThat: gsap.BackConfig) {
            if (Math.random() < 0.5) {
                return easeThat;
            }
            return easeThis;
        },
        respawn(particle: gsap.TweenTarget) {
            this.spawn(particle);
        },
        spawn(particle: gsap.TweenTarget) {
            const wholeDuration = (10 / this.speed) * (0.7 + Math.random() * 0.4),
                delay = wholeDuration * Math.random();
            let partialDuration = (wholeDuration + 1) * (0.2 + Math.random() * 0.3);

            gsap.set(particle, {
                y: this.range(this.start.yMin, this.start.yMax),
                x: this.range(this.start.xMin, this.start.xMax),
                scaleX: this.range(this.start.scaleXMin, this.start.scaleXMax),
                scaleY: this.range(this.start.scaleYMin, this.start.scaleYMax),
                scale: this.range(this.start.scaleMin, this.start.scaleMax),
                opacity: this.range(this.start.opacityMin, this.start.opacityMax),
                visibility: 'hidden',
            });
            // Moving upward
            gsap.to(particle, {
                duration: partialDuration,
                delay: delay,
                y: this.range(this.mid.yMin, this.mid.yMax),
                ease: this.randomEase(Linear.easeOut, Back.easeInOut),
            });
            gsap.to(particle, {
                duration: wholeDuration - partialDuration,
                delay: partialDuration + delay,
                y: this.range(this.end.yMin, this.end.yMax),
                ease: Back.easeIn,
            });
            //Moving on axis X
            gsap.to(particle, {
                duration: partialDuration,
                delay: delay,
                x: this.range(this.mid.xMin, this.mid.xMax),
                ease: Power1.easeOut,
            });
            gsap.to(particle, {
                duration: wholeDuration - partialDuration,
                delay: partialDuration + delay,
                x: this.range(this.end.xMin, this.end.xMax),
                ease: Power1.easeIn,
            });
            //opacity and scale
            partialDuration = wholeDuration * (0.5 + Math.random() * 0.3);
            gsap.to(particle, {
                duration: partialDuration,
                delay: delay,
                scale: this.range(this.mid.scaleMin, this.mid.scaleMax),
                autoAlpha: this.range(this.mid.opacityMin, this.mid.opacityMax),
                ease: Linear.easeNone,
            });
            gsap.to(particle, {
                duration: wholeDuration - partialDuration,
                delay: partialDuration + delay,
                scale: this.range(this.end.scaleMin, this.end.scaleMax),
                autoAlpha: this.range(this.end.opacityMin, this.end.opacityMax),
                ease: Linear.easeNone,
                onComplete: this.respawn,
                onCompleteParams: [particle],
            });
        },
        createParticle() {
            for (let i = 0; i < this.density; ++i) {
                const particleSpark = document.createElement('div');
                particleSpark.classList.add('spark');
                document.body.appendChild(particleSpark);
                this.spawn(particleSpark);
            }
        },
    },
    mounted() {
        this.createParticle();
    },
    beforeUnmount() {
        this.respawn = doNothing;
        document.querySelectorAll('body > .spark').forEach((e) => e.remove());
    },
});
</script>

<style scoped lang="scss">
@import 'src/css/animations/pulse.scss';

.authentication-container {
    display: grid;
    grid-template-rows: 60% 380px;

    .breadwinner-title {
        animation-delay: 0.5s;
        @include pulse;
        margin-bottom: 200px;
        user-select: none;
    }

    .breadwinner-logo {
        top: 100px;
    }
}
</style>
