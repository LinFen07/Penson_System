import * as anime from 'animejs';
import { unref, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export const useAnimation = (
  target: Ref<HTMLElement | null> | HTMLElement | string,
  params: Omit<typeof anime.AnimeParams, 'targets'>
) => {
  let animation: typeof anime.AnimeInstance | null = null;

  const play = () => {
    const targets = unref(target);
    if (!targets) return null;

    animation?.pause();
    animation = anime.default({
      targets,
      ...params,
    });

    return animation;
  };

  const pause = () => {
    animation?.pause();
  };

  onUnmounted(() => {
    animation?.pause();
  });

  return { play, pause };
};