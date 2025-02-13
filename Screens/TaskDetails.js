      <TouchableOpacity onPress={() => {setActiveComponent(selectedTask.title)}} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Open</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowTaskDetail(false)} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
