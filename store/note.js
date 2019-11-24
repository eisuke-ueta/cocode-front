import cloneDeep from 'lodash/cloneDeep'

const createQuery = (offset, limit, status, userId, keyword) => {
  let query = ''
  query += offset ? '&offset=' + offset : '&offset=0'
  query += limit ? '&limit=' + limit : '&limit=10'
  query += status ? '&status=' + status : '&status=published'
  if (userId) query += '&userId=' + userId
  if (keyword) query += '&keyword=' + keyword
  return query
}

const createFormData = form => {
  const formData = new FormData()
  const fields = JSON.stringify({
    id: form.id,
    userId: form.userId,
    title: form.title,
    tags: form.tags,
    description: form.description,
    status: form.status
  })
  if (fields) formData.append('fields', fields)
  return formData
}

export const state = () => ({
  note: null,
  notes: [],
  count: 0
})

export const mutations = {
  setNote(state, { note }) {
    state.note = note
  },
  setNotes(state, { notes }) {
    state.notes = notes
  },
  addNotes(state, { newNotes }) {
    state.notes = state.notes.concat(newNotes)
  },
  setNoteCount(state, { count }) {
    state.count = count
  }
}

export const actions = {
  async getNote({ commit, dispatch }, { id }) {
    try {
      const response = await this.$axios.get(`notes/${id}`)
      if (response && response.status === 200) {
        await commit('setNote', { note: cloneDeep(response.data.note) })
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async createNote({ commit }, { form }) {
    try {
      const formData = createFormData(form)
      const response = await this.$axios.post('notes/create', formData)
      return response
    } catch (e) {
      return e.response
    }
  },
  async updateNote({ commit }, { form }) {
    try {
      const formData = createFormData(form)
      const response = await this.$axios.post('notes/update', formData)
      return response
    } catch (e) {
      return e.response
    }
  },
  async deleteNote({ commit }, { id }) {
    try {
      const response = await this.$axios.delete(`notes/delete/${id}`)
      if (response && response.status === 200) {
        await commit('setNote', { note: null })
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async getNotes({ commit }, { offset, limit, status, userId, keyword }) {
    try {
      const query = createQuery(offset, limit, status, userId, keyword)
      const response = await this.$axios.get(`notes?${query}`)
      if (response && response.status === 200) {
        await commit('setNotes', { notes: response.data.notes })
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async getNoteCount({ commit }, { status, userId, keyword }) {
    try {
      // TODO Add limit of notes per user
      const query = createQuery(0, 1000, status, userId, keyword)
      const response = await this.$axios.get(`notes/count?${query}`)
      if (response && response.status === 200) {
        await commit('setNoteCount', { count: response.data.count })
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async addNotes({ commit }, { offset, limit, status, userId, keyword }) {
    try {
      const query = createQuery(offset, limit, status, userId, keyword)
      const response = await this.$axios.get(`notes?${query}`)
      if (response && response.status === 200) {
        await commit('addNotes', { newNotes: response.data.notes })
      }
      return response
    } catch (e) {
      return e.response
    }
  }
}
