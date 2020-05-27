export default (ref, dimensional) => {
    let canvas = ref;
    let ctx = ref.getContext(dimensional);
    return ctx;
};
