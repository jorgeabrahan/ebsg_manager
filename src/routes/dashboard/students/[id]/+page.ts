export const ssr = false;

export const load = ({ params }) => {
  return { id: params.id };
};
