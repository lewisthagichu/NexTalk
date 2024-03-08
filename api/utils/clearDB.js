function deleteAll(collection) {
  collection
    .deleteMany({})
    .then(() => {
      console.log('Collection deleted successfully');
    })
    .catch((err) => {
      console.error('Error deleting collection:', err);
    });
}

module.exports = { deleteAll };
